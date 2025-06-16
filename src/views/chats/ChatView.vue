<script setup lang="ts">
import ChatInputBox from "@/components/chat/ChatInputBox.vue";
import ChatHistory from "@/components/chat/ChatHistory.vue";
import ChatList from "@/components/chat/ChatList.vue";
import ChatHeader from "@/components/chat/ChatHeader.vue";
import RoomUserList from "@/components/chat/ChatRoomUserList.vue";
import { ref, watch, onMounted } from "vue";
import { useChatStore } from "@/stores/chat";
import { Chat } from "@/types/Chat";
const chatStore = useChatStore();
const currentChat = ref<Chat | null>(null);

function selectChat(chatName: string) {
  // selectedChat.value = chatName;
  const chat = chatStore.getChat(chatName) as Chat;
  if (!chat) {
    return;
  }
  currentChat.value = chat;
}

onMounted(() => {
  const chats = chatStore.getChats;
  currentChat.value = chats[0];
});
</script>
<template>
  <div class="grid grid-cols-[20%_80%] h-full">
    <div class="grid overflow-auto h-full">
      <ChatList @selectChat="selectChat" />
    </div>
    <div class="grid grid-rows-[10%_80%_10%] overflow-auto">
      <div class="grid p-4 border-b-2 border-gray-300">
        <ChatHeader v-if="currentChat" :chat="currentChat" />
      </div>

      <div class="grid overflow-auto p-4">
        <ChatHistory :messages="currentChat?.history" />
      </div>

      <div class="grid">
        <ChatInputBox :chat="currentChat" />
      </div>
    </div>
  </div>
</template>
