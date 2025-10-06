import { defineStore } from "pinia";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { Chat, ChatType } from "@/types/Chat";
import { useUserStore } from "@/stores/user";
import { chatUtils } from "@/utils/chat";
import { useGroupStore } from "./group";
import { userService } from "@/services/userService";
import type { ChatMessageRequest } from "@/types/request/ChatMessageRequest";
import type { ChatMessageResponse } from "@/types/response/ChatMessageResponse";
import { computed, ref, type Ref } from "vue";
const { generateChatId, createChatFromMessage, generateChatIdFromMessage } =
  chatUtils();

export const useChatStore = defineStore("chat", () => {
  const chats = ref<Chat[]>([]);
  const selectedChatId = ref<string>("");
  const subscriptions = new Map<string, string>();
  const initialized = ref(false);
  const token = localStorage.getItem("token");
  const client = new Client({
    webSocketFactory: () =>
      new SockJS(`${import.meta.env.VITE_APP_WS_URL}?token=${token}`),
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  const getSelectedChat = computed(() => {
    return getChat(selectedChatId.value);
  });

  function getChat(id: string): Chat | undefined {
    return chats.value.find((chat) => chat.id === id);
  }

  function saveChatState() {
    localStorage.setItem("chats", JSON.stringify(chats.value));
    localStorage.setItem("selectedChatId", selectedChatId.value);
  }

  function selectChat(chatId: string) {
    selectedChatId.value = chatId;
    saveChatState();
  }

  async function addChat(newChat: Chat) {
    const chatExists = getChat(newChat.id);
    if (chatExists) {
      return;
    }

    if (newChat.type == "GROUP" && newChat.groupId) {
      await subscribeToChat("GROUP", newChat.groupId);
    }

    // fetch the user avatar
    if (newChat.type == "PRIVATE" && newChat.userId && !newChat.imageUrl) {
      newChat.imageUrl = URL.createObjectURL(
        await userService.fetchProfileImage(newChat.userId)
      );
    }

    chats.value.push(newChat);
    saveChatState();
  }
  async function deleteChat(chatId: string) {
    const index = chats.value.findIndex((chat) => chat.id === chatId);
    chats.value.splice(index, 1);
    saveChatState();
  }
  async function sendMessage(message: ChatMessageRequest) {
    if (!client.connected) {
      return;
    }

    const chat = getChat(generateChatId("PRIVATE", message.toId));
    chat?.history.push({
      fromUserName: useUserStore().user.userName,
      fromUserId: useUserStore().user.id,
      message: message.message,
      timestamp: new Date(),
    });

    client.publish({
      destination: "/app/chat",
      body: JSON.stringify(message),
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
    saveChatState();
  }
  async function handleMessage(chatMessage: ChatMessageResponse) {
    console.log(`Received message `, chatMessage);
    const chatId = generateChatIdFromMessage(chatMessage);
    const chat: Ref<Chat | undefined> = ref(getChat(chatId));

    // create chat
    if (!chat.value) {
      // when chat does not exist we created with the id of the sender
      chat.value = await createChatFromMessage(chatMessage);
      await addChat(chat.value);
    }

    chat.value.history.push(chatMessage);
    saveChatState();
  }

  async function subscribeToChat(chatType: ChatType, id: number) {
    const chatId = generateChatId(chatType, id);
    if (!client.connected) {
      return;
    }

    // check if subscription already exists
    if (subscriptions.get(chatId)) {
      return;
    }

    let subscribePath = `/topic/chat/${chatType}/${id}`;
    if (chatType === "PRIVATE") {
      subscribePath = `/user/queue/messages`;
    }

    const sub = client.subscribe(subscribePath, (message) => {
      const chatMessage: ChatMessageResponse = JSON.parse(message.body);
      if (!chatMessage.toId) {
        return;
      }
      handleMessage(chatMessage);
    });

    // add the subscription
    subscriptions.set(chatId, sub.id);
  }

  async function unSuscribeFromChat(chatId: string) {
    if (!client.connected) {
      return;
    }

    // get the sub id for the chatId
    const subId = subscriptions.get(chatId);

    // if the subscription exists
    if (subId) {
      // unsubscribe
      client.unsubscribe(subId);
      // delete the sub
      subscriptions.delete(chatId);
    }
  }

  async function initialize() {
    const storedChats = localStorage.getItem("chats") ?? "";
    if (storedChats) {
      chats.value = JSON.parse(storedChats);
    }

    selectedChatId.value = localStorage.getItem("selectedChatId") ?? "";

    for (const chat of chats.value) {
      if (chat.type === "GROUP") {
        continue;
      }

      try {
        if (chat.userId) {
          const resource = await userService.fetchProfileImage(chat.userId);
          chat.imageUrl = URL.createObjectURL(resource);
        }
      } catch (error) {
        chat.imageUrl = undefined;
      }
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const userStore = useUserStore();

    client.onConnect = async (frame) => {
      const groups = useGroupStore().groups;
      for (const group of groups) {
        await subscribeToChat("GROUP", group.id);
      }

      // Subscribe to the logged-in customer's private chat
      await subscribeToChat("PRIVATE", userStore.getLoggedUser.id);
    };

    client.activate();

    // initialized = true;
  }

  return {
    chats,
    subscribeToChat,
    unSuscribeFromChat,
    initialize,
    initialized,
    sendMessage,
    deleteChat,
    selectChat,
    getSelectedChat,
    getChat,
    addChat,
  };
});
