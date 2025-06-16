<script setup lang="ts">
import ChatInputBox from "@/components/chat/ChatInputBox.vue";
import ChatHistory from "@/components/chat/ChatHistory.vue";
import ChatList from "@/components/chat/ChatList.vue";
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
  <div class="grid grid-cols-[20%_80%] h-full">
    <div class="grid overflow-auto h-full">
      <ChatList @selectTab="selectTab" />
    </div>
    <div class="grid grid-rows-[90%_10%] overflow-auto">
      <div class="grid overflow-auto p-4">
        <ChatHistory :messages="currentChat?.history" />
      </div>

      <div class="grid">
        <ChatInputBox />
      </div>
    </div>
  </div>
</template>
