<script setup lang="ts">
import ChatInputBox from "@/components/chat/ChatInputBox.vue";
import ChatHistory from "@/components/chat/ChatHistory.vue";
import TabLayout from "@/layouts/chat/TabLayout.vue";
import RoomUserList from "@/components/chat/ChatRoomUserList.vue";
import { ref, watch } from "vue";
import { useChatStore } from "@/stores/chat";
import { Chat } from "@/types/Chat";
const chatStore = useChatStore();
const selectedTab = ref();
const currentChat = ref<Chat | null>(null);

watch(selectedTab, (newVal) => {
  const chat = chatStore.getChat(selectedTab.value) as Chat;
  currentChat.value = chat;
});

function selectTab(tabName: string) {
  selectedTab.value = tabName;
}
</script>
<template>
  <div class="grid grid-rows-[2rem_28rem_1fr] h-full">
    <div class="grid overflow-auto">
      <TabLayout @selectTab="selectTab" />
    </div>
    <div
      v-if="currentChat && currentChat.type === 'CONVERSATION'"
      class="grid overflow-auto p-4"
    >
      <ChatHistory :messages="currentChat?.history" />
    </div>
    <div v-else class="grid grid-cols-[80%_20%]">
      <!-- Columna 1 -->
      <div class="overflow-auto p-4">
        <ChatHistory :messages="currentChat?.history" />
      </div>

      <!-- Columna 2 -->
      <div class="overflow-auto p-4 border-l-2 border-gray-300">
        <RoomUserList :participants="currentChat?.participants" />
      </div>
    </div>

    <div class="grid overflow-auto">
      <ChatInputBox />
    </div>
  </div>
</template>
