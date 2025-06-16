import { defineStore } from "pinia";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { Chat } from "@/types/Chat";
import { ChatMessage } from "@/types/ChatMessage";

export const useChatStore = defineStore("chat", {
  state: () => ({
    chats: [] as Chat[],
    socket: null as WebSocket | null,
    stompClient: null as Client | null,
    initialized: false,
  }),

  getters: {
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
    async appendMessage(chatName: string, message: ChatMessage) {
      this.getChat(chatName)?.history.push(message);
      localStorage.setItem("chats", JSON.stringify(this.chats));
    },
    async addChat(newChat: Chat) {
      const chatExists = this.chats.find((chat) => chat.name === newChat.name);
      if (!chatExists) {
        this.chats.push(newChat);
      }
      localStorage.setItem("chats", JSON.stringify(this.chats));
    },
    async deleteChat(chatName: string) {
      const index = this.chats.findIndex((chat) => chat.name === chatName);
      this.chats.splice(index, 1);
      localStorage.setItem("chats", JSON.stringify(this.chats));
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
      // const token = localStorage.getItem("token");
      // if (!token) {
      //   return;
      // }
      const storedChats = localStorage.getItem("chats");
      if (storedChats) {
        this.chats = JSON.parse(storedChats);
      }

      this.initialized = true;
    },
  },
});
