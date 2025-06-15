<script setup lang="ts">
import { defineProps } from "vue";
defineProps({
  messages: { sender: String, message: String },
});
function addMessage() {
  return;
}
</script>
<template>
  <div v-for="(message, index) in messages" :key="index">
    <p v-if="message.sender === 'DAMIAN'" class="text-right">
      {{ message.sender }}: {{ message.message }}
    </p>
    <p v-else class="text-left">{{ message.sender }}: {{ message.message }}</p>
  </div>
</template>
