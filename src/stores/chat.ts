import { defineStore } from "pinia";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { Chat, ChatType } from "@/types/Chat";
import { useUserStore } from "@/stores/user";
import { chatUtils } from "@/utils/chat";
import { useGroupStore } from "@/stores/group";
import { userService } from "@/services/userService";
import type { ChatMessageRequest } from "@/types/request/ChatMessageRequest";
import type { ChatMessageResponse } from "@/types/response/ChatMessageResponse";
import { computed, ref, type Ref } from "vue";
import { userUtils } from "@/utils/user";
const { userStoragePath } = userUtils();
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

  function chatExists(id: string): boolean {
    return chats.value.some((chat) => chat.id === id);
  }

  function saveChatState() {
    localStorage.setItem(userStoragePath("chats"), JSON.stringify(chats.value));
    localStorage.setItem(
      userStoragePath("selectedChatId"),
      selectedChatId.value
    );
  }

  function selectChat(chatId: string) {
    selectedChatId.value = chatId;
    saveChatState();
  }

  function clearChats() {
    localStorage.setItem(userStoragePath("chats"), "");
    chats.value = [];
  }

  async function initialize() {
    const storedChats = localStorage.getItem(userStoragePath("chats")) ?? "";
    if (storedChats) {
      chats.value = JSON.parse(storedChats);
    }

    selectedChatId.value =
      localStorage.getItem(userStoragePath("selectedChatId")) ?? "";

    for (const chat of chats.value) {
      if (chat.type === "GROUP") {
        continue;
      }

      // fetch all chat images
      try {
        if (chat.userId) {
          const resource = await userService.fetchProfileImage(chat.userId);
          chat.imageUrl = URL.createObjectURL(resource);
        }
      } catch (error) {
        chat.imageUrl = undefined;
      }
    }

    client.onConnect = async (_frame) => {
      const groups = useGroupStore().groups;
      for (const group of groups) {
        await subscribeToChat("GROUP", group.id);
      }

      const userStore = useUserStore();
      // Subscribe to the logged-in customer's private chat
      await subscribeToChat("PRIVATE", userStore.getLoggedUser.id);
    };

    client.activate();

    initialized.value = true;
  }

  async function addChat(newChat: Chat) {
    if (chatExists(newChat.id)) {
      return;
    }

    // if the chat to add its a group, subscribe to it
    if (newChat.type == "GROUP" && newChat.groupId) {
      await subscribeToChat("GROUP", newChat.groupId);
    }

    // if its a private chat fetch the user avatar
    if (newChat.type == "PRIVATE" && newChat.userId && !newChat.imageUrl) {
      newChat.imageUrl = URL.createObjectURL(
        await userService.fetchProfileImage(newChat.userId)
      );
    }

    chats.value.push(newChat);
    saveChatState();
  }

  async function deleteChat(chatId: string) {
    const chatIndex = chats.value.findIndex((chat) => chat.id === chatId);
    chats.value.splice(chatIndex, 1);
    saveChatState();
  }

  async function sendMessage(message: ChatMessageRequest) {
    if (!client.connected) {
      return;
    }

    const chatId = generateChatId("PRIVATE", message.toId);
    const chat = getChat(chatId);

    // add locally the message
    chat?.history.push({
      fromUserName: useUserStore().getFullName,
      fromUserId: useUserStore().user.id,
      message: message.message,
      timestamp: new Date(),
    });

    // send the message to the server
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
    if (!chatExists(chatId)) {
      // when chat does not exist we created with the id of the sender
      chat.value = await createChatFromMessage(chatMessage);
      await addChat(chat.value);
    }

    chat.value?.history.push(chatMessage);
    saveChatState();
  }

  async function subscribeToChat(chatType: ChatType, id: number) {
    if (!client.connected) {
      return;
    }

    const chatId = generateChatId(chatType, id);

    // check if subscription already exists. if exists does not add again
    if (subscriptions.get(chatId)) {
      return;
    }

    let subscribeToPath = `/topic/chat/${chatType}/${id}`;
    if (chatType === "PRIVATE") {
      subscribeToPath = `/user/queue/messages`;
    }

    const sub = client.subscribe(subscribeToPath, (message) => {
      const chatMessage: ChatMessageResponse = JSON.parse(message.body);
      if (!chatMessage.toId) {
        return;
      }
      handleMessage(chatMessage);
    });

    // add the subscription
    subscriptions.set(chatId, sub.id);
  }

  async function unsubscribeFromChat(chatId: string) {
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

  return {
    chats,
    subscribeToChat,
    unSuscribeFromChat: unsubscribeFromChat,
    initialize,
    initialized,
    sendMessage,
    chatExists,
    deleteChat,
    selectChat,
    getSelectedChat,
    getChat,
    clearChats,
    addChat,
  };
});
