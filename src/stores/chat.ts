import { defineStore } from "pinia";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { Chat } from "@/types/Chat";
import { ChatMessage } from "@/types/ChatMessage";
import { useCustomerStore } from "@/stores/customer";
import { useChat } from "@/composables/useChat";
import { useGroupStore } from "./group";
import { useContactStore } from "./contact";
const { generateChatId, createChatFromMessage } = useChat();

export const useChatStore = defineStore("chat", {
  state: () => ({
    chats: [] as Chat[],
    selectedChatId: "" as string,
    socket: null as WebSocket | null,
    stompClient: null as CompatClient | null,
    subscriptions: new Map<string, string>(),
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
      const chatExists = this.chats.find((chat) => chat.id === newChat.id);
      if (chatExists) {
        return;
      }

      await this.subscribeToChat(newChat.id);
      this.chats.push(newChat);
      this.saveChatState();
    },
    async deleteChat(chatId: string) {
      await this.unSuscribeFromChat(chatId);
      const index = this.chats.findIndex((chat) => chat.id === chatId);
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
    async handleMessage(chatMessage: ChatMessage) {
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
      }

      // Create a new chat if it doesn't exist
      if (!this.getChat(chatMessage.chatId)) {
        const newChat: Chat = await createChatFromMessage(chatMessage);
        await this.addChat(newChat);
      }

      this.getChat(chatMessage.chatId)?.history.push(chatMessage);
      this.saveChatState();
    },
    async subscribeToChat(chatId: string) {
      if (!this.stompClient) {
        return;
      }

      // check if subscription already exists
      if (this.subscriptions.get(chatId)) {
        return;
      }

      const sub = this.stompClient.subscribe(
        `/topic/chat.${chatId}`,
        (message) => {
          const chatMessage = JSON.parse(message.body) as ChatMessage;
          if (!chatMessage.chatId) {
            return;
          }
          this.handleMessage(chatMessage);
        }
      );

      // add the subscription
      this.subscriptions.set(chatId, sub.id);
    },
    async unSuscribeFromChat(chatId: string) {
      if (!this.stompClient) {
        return;
      }

      // get the sub id for the chatId
      const subId = this.subscriptions.get(chatId);

      // if the subscription exists
      if (subId) {
        // unsubscribe
        this.stompClient.unsubscribe(subId);
        // delete the sub
        this.subscriptions.delete(chatId);
      }
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
          const contacts = useContactStore().getContacts;
          for (const contact of contacts) {
            await this.subscribeToChat(generateChatId("PRIVATE", contact.id));
          }

          const groups = useGroupStore().getGroups;
          for (const group of groups) {
            await this.subscribeToChat(generateChatId("GROUP", group.id));
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
