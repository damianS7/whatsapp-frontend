<script setup lang="ts">
import type { Chat } from "@/types/Chat";
import { useChatStore } from "@/stores/chat";
import CustomAvatar from "@/components/CustomAvatar.vue";

defineProps<{
  chat: Chat;
}>();

// store
const chatStore = useChatStore();

function getLastMessageFromChat(chat: Chat) {
  const lastMessageIndex = chat.history.length - 1;
  if (lastMessageIndex < 0) {
    return;
  }
  return chat.history[lastMessageIndex].message;
}
</script>
<template>
  <div
    v-if="chat"
    class="flex gap-2 p-2 items-center cursor-pointer hover:bg-gray-100 hover:rounded-md"
    :class="{
      'bg-gray-100 rounded-md': chat.id === chatStore.getSelectedChat?.id,
    }"
    @click="chatStore.selectChat(chat.id)"
    @contextmenu="chatStore.selectChat(chat.id)"
  >
    <!-- avatar -->
    <div class="flex-shrink-0">
      <div
        class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold uppercase"
      >
        <CustomAvatar :src="chat.imageSrc" :fallback="chat.name" />
      </div>
    </div>

    <!-- chatname and last message -->
    <div class="flex flex-col w-full">
      <span class="font-semibold text-sm text-gray-800">{{ chat.name }}</span>
      <span class="text-gray-500 text-xs truncate max-w-[160px]">
        {{ getLastMessageFromChat(chat) || "&nbsp;" }}
      </span>
    </div>
  </div>
</template>
