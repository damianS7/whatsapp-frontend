<script setup lang="ts">
import { useChatStore } from "@/stores/chat";
import type { Chat } from "@/types/Chat";
import { ChatMessage } from "@/types/ChatMessage";
import type { Customer } from "@/types/Customer";
import { ref, defineProps } from "vue";
import { useChat } from "@/composables/useChat";
const { generateChatId, getDestinationCustomer } = useChat();
interface Props {
  fromCustomer: Customer;
  chat: Chat;
}
const props = defineProps<Props>();

const chatStore = useChatStore();
const textarea = ref("");
function send() {
  if (!textarea.value || textarea.value.length > 0) {
    return;
  }

  const message = {
    chatId: "",
    fromCustomerId: props.fromCustomer.id,
    fromCustomerName: props.fromCustomer.profile.firstName,
    chatType: props.chat.type,
    message: textarea.value,
    timestamp: new Date(),
  } as ChatMessage;

  if (props.chat.type === "GROUP" && props.chat.groupId) {
    message.groupId = props.chat.groupId;
    message.chatId = generateChatId("GROUP", message.groupId);
  }

  if (props.chat.type === "PRIVATE") {
    const destinationCustomer = getDestinationCustomer(props.chat);
    if (!destinationCustomer) {
      return;
    }
    message.toCustomerId = destinationCustomer.customerId;
    message.chatId = generateChatId("PRIVATE", destinationCustomer.customerId);
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
