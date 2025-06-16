<script setup lang="ts">
import { defineProps } from "vue";
import { useChatStore } from "@/stores/chat";
import Chat from "@/types/Chat";
const chatStore = useChatStore();

defineProps({
  chat: Chat,
});
</script>
<template>
  <div>
    {{ chat.name }}
  </div>
</template>
