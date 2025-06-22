import { defineStore } from "pinia";
import SockJS from "sockjs-client";
import { Client, CompatClient, Stomp } from "@stomp/stompjs";
import { Chat } from "@/types/Chat";
import { ChatMessage } from "@/types/ChatMessage";
import { useCustomerStore } from "@/stores/customer";

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
      return (id: number) => {
        return state.chats.find((chat) => {
          if (chat.type === "PRIVATE") {
            return chat.toCustomerId === id;
          }
          return chat.groupId === id;
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
      if (!chatExists) {
        this.chats.push(newChat);
      }
      this.saveChatState();

      const chatId =
        newChat.type === "PRIVATE" ? newChat.toCustomerId : newChat.groupId;

      if (!chatId) {
        return;
      }

      await this.subscribeToChat(newChat.type, chatId);
    },
    async deleteChat(chatName: string) {
      const index = this.chats.findIndex((chat) => chat.name === chatName);
      this.chats.splice(index, 1);
      this.saveChatState();
      // this.unSuscribeFromChat(chatName);
    },
    async sendMessage(
      chatType: string,
      chatName: string,
      message: ChatMessage
    ) {
      if (!this.stompClient) {
        return;
      }

      this.stompClient.send(
        `/app/chat.send.${chatType}.${chatName}`,
        {},
        JSON.stringify(message)
      );
      this.saveChatState();
    },
    async subscribeToChat(chatType: string, chatId: number) {
      if (!this.stompClient) {
        return;
      }

      this.stompClient.subscribe(
        `/topic/chat.${chatType}.${chatId}`,
        (message) => {
          const chatMessage = JSON.parse(message.body) as ChatMessage;
          console.log(
            `Received message for chat: ${chatType}.${chatId}`,
            chatMessage
          );

          if (chatType === "PRIVATE" && chatMessage.toCustomerId) {
            chatId = chatMessage.toCustomerId;

            if (
              chatMessage.toCustomerId ===
                useCustomerStore().getLoggedCustomer.id &&
              chatMessage.fromCustomerId
            ) {
              chatId = chatMessage.fromCustomerId;
            }

            this.getChatById(chatId)?.history.push(
              JSON.parse(message.body) as ChatMessage
            );
          }

          if (chatType === "GROUP" && chatMessage.groupId) {
            this.getChatById(chatMessage.groupId)?.history.push(
              JSON.parse(message.body) as ChatMessage
            );
          }
          this.saveChatState();
        }
      );
      // console.log(`Subscribed to chat: /topic/chat.${chatType}.${chatId}`);
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
            const chatId =
              chat.type === "PRIVATE" ? chat.toCustomerId : chat.groupId;

            if (chatId) {
              await this.subscribeToChat(chat.type, chatId);
            }
          }

          // Subscribe to the logged-in customer's private chat
          await this.subscribeToChat(
            "PRIVATE",
            customerStore.getLoggedCustomer.id
          );
        }
      );

      this.initialized = true;
    },
  },
});
