import { defineStore } from "pinia";
import SockJS from "sockjs-client";
import { Client, CompatClient, Stomp } from "@stomp/stompjs";
import { Chat } from "@/types/Chat";
import { ChatMessage } from "@/types/ChatMessage";
import { useCustomerStore } from "@/stores/customer";
import { useChat } from "@/composables/useChat";
const { generateChatId } = useChat();

export const useChatStore = defineStore("chat", {
  state: () => ({
    chats: [] as Chat[],
    selectedChatName: "",
    socket: null as WebSocket | null,
    stompClient: null as CompatClient | null,
    initialized: false,
  }),

  getters: {
    getSelectedChat(): Chat | undefined {
      return this.getChat(this.selectedChatName);
    },
    getSelectedChatName: (state) => {
      return state.selectedChatName;
    },
    getChats: (state): Chat[] => {
      return state.chats;
    },
    getChat: (state) => {
      return (name: string) => {
        return state.chats.find((chat) => chat.name === name);
      };
    },
    getChatById: (state) => {
      return (id: string) => {
        return state.chats.find((chat) => {
          return chat.id === id;
        });
      };
    },
  },

  actions: {
    saveChatState() {
      localStorage.setItem("chats", JSON.stringify(this.chats));
      localStorage.setItem("selectedChatName", this.selectedChatName);
    },
    selectChat(name: string) {
      this.selectedChatName = name;
      this.saveChatState();
    },
    async addChat(newChat: Chat) {
      const chatExists = this.chats.find((chat) => chat.name === newChat.name);
      if (chatExists) {
        return;
      }

      this.chats.push(newChat);
      this.saveChatState();

      await this.subscribeToChat(newChat.id);
    },
    async deleteChat(chatName: string) {
      const index = this.chats.findIndex((chat) => chat.name === chatName);
      this.chats.splice(index, 1);
      this.saveChatState();
      // this.unSuscribeFromChat(chatName);
    },
    async sendMessage(message: ChatMessage) {
      if (!this.stompClient) {
        return;
      }

      this.stompClient.send(
        `/app/chat.send.${message.chatId}`,
        {},
        JSON.stringify(message)
      );
      this.saveChatState();
    },
    handleMessage(chatMessage: ChatMessage) {
      console.log(
        `Received message for chat: ${chatMessage.chatId}`,
        chatMessage
      );
      const customerStore = useCustomerStore();

      // if chatMessage its a private message ...
      if (chatMessage.chatType === "PRIVATE" && chatMessage.toCustomerId) {
        // if the message its sent to the logged customer
        if (
          chatMessage.toCustomerId === customerStore.getLoggedCustomer.id &&
          chatMessage.fromCustomerId
        ) {
          chatMessage.chatId = generateChatId(
            "PRIVATE",
            chatMessage.fromCustomerId
          );
        }

        // Create a new chat if it doesn't exist
        if (!this.getChatById(chatMessage.chatId)) {
          const newChat: Chat = {
            id: chatMessage.chatId,
            name: chatMessage.fromCustomerName,
            type: "PRIVATE",
            history: [],
            participants: [
              {
                customerId: chatMessage.fromCustomerId,
                customerName: chatMessage.fromCustomerName,
                customerAvatar: "",
              },
              {
                customerId: customerStore.getLoggedCustomer.id,
                customerName: customerStore.getLoggedCustomer.profile.firstName,
                customerAvatar:
                  customerStore.getLoggedCustomer.profile.avatarFilename || "",
              },
            ],
          };
          this.chats.push(newChat);
          this.subscribeToChat(newChat.id);
        }
      }

      this.getChatById(chatMessage.chatId)?.history.push(chatMessage);
      this.saveChatState();
    },
    async subscribeToChat(chatId: string) {
      if (!this.stompClient) {
        return;
      }

      this.stompClient.subscribe(`/topic/chat.${chatId}`, (message) => {
        const chatMessage = JSON.parse(message.body) as ChatMessage;
        if (!chatMessage.chatId) {
          return;
        }
        this.handleMessage(chatMessage);
      });
    },
    async unSuscribeFromChat(chatName: string) {
      if (!this.stompClient) {
        return;
      }
      this.stompClient.unsubscribe(`/topic/chat/${chatName}`);
    },
    async initialize() {
      const storedChats = localStorage.getItem("chats");
      const storedSelectedChatName = localStorage.getItem("selectedChatName");
      if (storedChats) {
        this.chats = JSON.parse(storedChats);
      }

      if (storedSelectedChatName) {
        this.selectedChatName = storedSelectedChatName;
      }

      // set up WebSocket connection
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const customerStore = useCustomerStore();

      this.socket = new SockJS(`${process.env.VUE_APP_WS_URL}`);
      this.stompClient = Stomp.over(this.socket);

      this.stompClient.connect(
        { Authorization: `Bearer ${token}` },
        async () => {
          for (const chat of this.chats) {
            await this.subscribeToChat(chat.id);
          }

          // Subscribe to the logged-in customer's private chat
          await this.subscribeToChat(
            generateChatId("PRIVATE", customerStore.getLoggedCustomer.id)
          );
        }
      );

      this.initialized = true;
    },
  },
});
