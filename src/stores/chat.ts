import { defineStore } from "pinia";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { Chat } from "@/types/Chat";
import { ChatMessage } from "@/types/ChatMessage";

export const useChatStore = defineStore("chat", {
  state: () => ({
    chats: [] as Chat[],
    selectedChatName: "",
    socket: null as WebSocket | null,
    stompClient: null as Client | null,
    initialized: false,
  }),

  getters: {
    getSelectedChat(): Chat | undefined {
      return this.getChat(this.selectedChatName);
    },
    getSelectedChatName: (state) => {
      return state.selectedChatName;
    },
    getChats: (state) => {
      return state.chats;
    },
    getChat: (state) => {
      return (name: string) => {
        return state.chats.find((chat) => chat.name === name);
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
    async sendMessage(chatName: string, message: ChatMessage) {
      this.getChat(chatName)?.history.push(message);
      this.saveChatState();
    },
    async addChat(newChat: Chat) {
      const chatExists = this.chats.find((chat) => chat.name === newChat.name);
      if (!chatExists) {
        this.chats.push(newChat);
      }
      this.saveChatState();
    },
    async deleteChat(chatName: string) {
      const index = this.chats.findIndex((chat) => chat.name === chatName);
      this.chats.splice(index, 1);
      this.saveChatState();
    },
    async subscribeToRoom(room: string) {
      const token = localStorage.getItem("token");
      this.socket = new SockJS(
        `${process.env.VUE_APP_API_URL}/ws/connect?token=${token}`
      );

      this.stompClient = new Client({
        webSocketFactory: () => this.socket,
        reconnectDelay: 5000,
        onConnect: () => {
          console.log("Connected");
        },
        onStompError: (frame) => {
          console.error("Broker error: " + frame.headers["message"]);
        },
      });

      this.stompClient.activate();
      // this.stompClient.connect({}, function (frame) {
      //   // Subscribirse al endpoint /messages
      //   // hara que todo lo que se envie a ese
      //   // path sea reenviado a todos los subscriptores
      //   dis.stompClient.subscribe("/room/message", function (response) {
      //     context.dispatch("addMessage", JSON.parse(response.body));
      //   });
      // });
    },
    unSuscribeFromRoom(room: any) {
      if (this.stompClient !== null) {
        // this.stompClient.disconnect();
        this.stompClient.deactivate();
      }
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

      // TODO: connect to websocket
      // TODO: subscribe to /customers/{id}

      this.initialized = true;
    },
  },
});
