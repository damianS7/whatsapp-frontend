import { defineStore } from "pinia";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { Chat } from "@/types/Chat";
import { ChatMessage } from "@/types/ChatMessage";
import { useCustomerStore } from "@/stores/customer";
import { useChat } from "@/composables/useChat";
const { generateChatId } = useChat();

export const useChatStore = defineStore("chat", {
  state: () => ({
    chats: [] as Chat[],
    selectedChatId: "" as string,
    socket: null as WebSocket | null,
    stompClient: null as CompatClient | null,
    initialized: false,
  }),

  getters: {
    getSelectedChat(): Chat | undefined {
      return this.getChat(this.selectedChatId);
    },
    getSelectedChatName(): string | undefined {
      return this.getChat(this.selectedChatId)?.name;
    },
    getChats: (state): Chat[] => {
      return state.chats;
    },
    getChat: (state) => {
      return (id: string) => {
        return state.chats.find((chat) => {
          return chat.id === id;
        });
      };
    },
    getChatByName: (state) => {
      return (name: string) => {
        return state.chats.find((chat) => chat.name === name);
      };
    },
  },
  actions: {
    saveChatState() {
      localStorage.setItem("chats", JSON.stringify(this.chats));
      localStorage.setItem("selectedChatId", this.selectedChatId);
    },
    selectChat(chatId: string) {
      this.selectedChatId = chatId;
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
        if (!this.getChat(chatMessage.chatId)) {
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
          this.addChat(newChat);
        }
      }

      this.getChat(chatMessage.chatId)?.history.push(chatMessage);
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
    async unSuscribeFromChat(chatId: string) {
      if (!this.stompClient) {
        return;
      }
      this.stompClient.unsubscribe(`/topic/chat/${chatId}`);
    },
    async initialize() {
      const storedChats = localStorage.getItem("chats");
      const storedSelectedChatId = localStorage.getItem("selectedChatId");
      if (storedChats) {
        this.chats = JSON.parse(storedChats);
      }

      if (storedSelectedChatId) {
        this.selectedChatId = storedSelectedChatId;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const customerStore = useCustomerStore();

      // set up WebSocket connection
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
