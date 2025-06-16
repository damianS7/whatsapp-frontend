<script setup lang="ts">
import { ref, defineProps, onUpdated } from "vue";
import type ChatMessage from "@/types/ChatMessage";
defineProps({
  messages: [] as ChatMessage[],
});
const chatContainer = ref<HTMLElement | null>(null);
const scrollToBottom = () => {
  console.log("scrolling to botton");
  console.log("scrolling to botton" + chatContainer.value);
  if (chatContainer.value) {
    chatContainer.value.scrollTop = 10;
  }
};

onUpdated(scrollToBottom);
// TODO: get current user
// TODO: caret to end
</script>
<template>
  <div v-for="(message, index) in messages" :key="index" ref="chatContainer">
    <p v-if="message.senderName === 'DAMIAN'" class="text-right">
      {{ message.senderName }}: {{ message.message }}
    </p>
    <p v-else class="text-left">
      {{ message.senderName }}: {{ message.message }}
    </p>
  </div>
</template>
