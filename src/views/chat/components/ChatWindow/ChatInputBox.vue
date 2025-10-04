<script setup lang="ts">
import { useChatStore } from "@/stores/chat";
import type { Chat } from "@/types/Chat";
import type { ChatMessage } from "@/types/ChatMessage";
import type { User } from "@/types/User";
import { ref, defineProps } from "vue";
import { useChat } from "@/composables/useChat";
const { generateChatId, getDestinationUser } = useChat();

const props = defineProps<{
  fromUser: User;
  chat: Chat;
}>();

const chatStore = useChatStore();
const textarea = ref("");
function send() {
  if (!textarea.value && textarea.value.length > 0) {
    return;
  }

  const message = {
    chatId: "",
    fromUserId: props.fromUser.id,
    fromUserName: props.fromUser.firstName,
    chatType: props.chat.type,
    message: textarea.value,
    timestamp: new Date(),
  } as ChatMessage;

  if (props.chat.type === "GROUP" && props.chat.groupId) {
    message.groupId = props.chat.groupId;
    message.chatId = generateChatId("GROUP", message.groupId);
  }

  if (props.chat.type === "PRIVATE") {
    const destinationUser = getDestinationUser(props.chat);
    if (!destinationUser) {
      return;
    }
    message.toUserId = destinationUser.userId;
    message.chatId = generateChatId("PRIVATE", destinationUser.userId);
  }

  chatStore.sendMessage(message);
  textarea.value = "";
}
</script>
<template>
  <div class="overflow-auto h-full p-2 border-t-2 border-gray-300">
    <textarea
      class="w-full h-full bg-gray-50 rounded-md px-3 py-1 text-xs border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200"
      v-model="textarea"
      @keypress.enter.prevent
      @keypress.enter="send"
    />
  </div>
</template>
