<script setup lang="ts">
import ChatInputBox from "@/components/chat/ChatInputBox.vue";
import ChatHistory from "@/components/chat/ChatHistory.vue";
import TabLayout from "@/layouts/chat/TabLayout.vue";

const messages = [
  "hello!",
  "hello!",
  "hello!",
  "hello!",
  "hello!",
  "hello!",
  "hello!",
  "hello!",
  "hello!",
  "hello!",
  "hello!",
];
</script>
<template>
  <div class="grid grid-rows-[2rem_28rem_1fr] h-full">
    <div class="grid">
      <TabLayout />
    </div>

    <div class="grid overflow-auto p-4">
      <ChatHistory :messages="messages" />
    </div>

    <!-- Fila 2: 1 columna 100% -->
    <div class="grid overflow-auto">
      <ChatInputBox />
    </div>
  </div>
</template>
