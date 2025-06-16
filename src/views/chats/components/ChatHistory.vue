<script setup lang="ts">
import { ref, defineProps, onUpdated } from "vue";
import type ChatMessage from "@/types/ChatMessage";
import type { Customer } from "@/types/Customer";
interface Props {
  user: Customer;
  messages: ChatMessage[];
}
const props = defineProps<Props>();
const chatContainer = ref<HTMLElement | null>(null);
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

function customerName() {
  return props.user.profile.firstName;
}
onUpdated(scrollToBottom);
</script>
<template>
  <div
    ref="chatContainer"
    class="overflow-x-hidden overflow-y-auto p-4 space-y-4"
  >
    <div
      v-for="(message, index) in messages"
      :key="index"
      :class="{
        'flex justify-end': message.senderName === customerName(),
        'flex justify-start': message.senderName !== customerName(),
      }"
    >
      <div class="max-w-xs sm:max-w-md bg-white rounded-lg p-2 shadow-md">
        <p class="text-sm font-semibold mb-1 text-gray-700">
          {{ message.senderName }}
        </p>
        <p class="text-base break-words mb-1">
          {{ message.message }}
        </p>
        <p class="text-xs italic text-gray-300 text-right">10-10-2025</p>
      </div>
    </div>
  </div>
</template>
