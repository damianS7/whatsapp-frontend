import { defineStore } from "pinia";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import type { Chat } from "@/types/Chat";
import type { ChatMessage } from "@/types/ChatMessage";
import { useUserStore } from "@/stores/user";
import { chatUtils } from "@/utils/chat";
import { useGroupStore } from "./group";
import { useContactStore } from "./contact";
import { userService } from "@/services/userService";
import { authUtils } from "@/utils/auth";
const {
  generateChatId,
  generateGroupChatId,
  generatePrivateChatId,
  createChatFromMessage,
} = chatUtils();

export const useChatStore = defineStore("chat", {
  state: () => ({
    // privateChats
    // groupChats
    chats: [] as Chat[],
    selectedChatId: "" as string,
    socket: null as WebSocket | null,
    stompClient: null as CompatClient | null,
    subscriptions: new Map<string, string>(),
    // initialized: false,
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
      // await this.unSuscribeFromChat(chatId);
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
      const userStore = useUserStore();

      if (chatMessage.fromUserName === "SYSTEM") {
        // check notification type
        // do something
        // send a message
      }

      // if chatMessage its a private message ...
      if (chatMessage.chatType === "PRIVATE" && chatMessage.toUserId) {
        // if the message its sent to the logged customer
        if (
          chatMessage.toUserId === userStore.getLoggedUser.id &&
          chatMessage.fromUserId
        ) {
          chatMessage.chatId = generateChatId(
            "PRIVATE",
            chatMessage.fromUserId
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

      for (const chat of this.chats) {
        if (chat.type === "GROUP") {
          continue;
        }

        try {
          const destinationCustomer = chatUtils().getDestinationUser(chat);
          if (destinationCustomer) {
            const resource = await userService.fetchProfileImage(
              destinationCustomer?.userId
            );
            chat.imageUrl = URL.createObjectURL(resource);
          }
        } catch (error) {
          chat.imageUrl = undefined;
        }
      }

      if (storedSelectedChatId) {
        this.selectedChatId = storedSelectedChatId;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const userStore = useUserStore();

      // set up WebSocket connection
      this.socket = new SockJS(`${import.meta.env.VITE_APP_WS_URL}`);
      this.stompClient = Stomp.over(this.socket);

      this.stompClient.connect(
        { Authorization: `Bearer ${token}` },
        async () => {
          const contacts = useContactStore().contacts;
          for (const contact of contacts) {
            await this.subscribeToChat(generatePrivateChatId(contact));
          }

          const groups = useGroupStore().groups;
          for (const group of groups) {
            await this.subscribeToChat(generateGroupChatId(group));
          }

          // subscribe to chats that are not contacts
          for (const chat of this.chats) {
            if (chat.type === "GROUP") {
              // useGroupStore().groupExists(chat.groupId)
              continue;
            }

            if (chat.type === "PRIVATE") {
              const destinationUser = chatUtils().getDestinationUser(chat);
              if (destinationUser) {
                await this.subscribeToChat(
                  generateChatId("PRIVATE", destinationUser.userId)
                );
              }
              continue;
            }
          }

          // Subscribe to the logged-in customer's private chat
          await this.subscribeToChat(
            generateChatId("PRIVATE", userStore.getLoggedUser.id)
          );
        }
      );

      // this.initialized = true;
    },
  },
});
