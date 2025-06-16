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
// TODO: caret to end
</script>
<template>
  <div ref="chatContainer" class="overflow-x-hidden overflow-y-auto">
    <div v-for="(message, index) in messages" :key="index">
      <div
        v-if="message.senderName === customerName()"
        class="mb-4 rounded text-right"
      >
        <span
          class="bg-green-300 p-2 rounded text-right break-words justify-normal"
        >
          {{ message.senderName }}: {{ message.message }}
        </span>
      </div>
      <div v-else class="text-left">
        {{ message.senderName }}: {{ message.message }}
      </div>
    </div>
  </div>
</template>
