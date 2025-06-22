<script setup lang="ts">
import { Chat } from "@/types/Chat";
import { ref, computed, defineEmits } from "vue";
import { useChatStore } from "@/stores/chat";
import { MessageSquarePlus } from "lucide-vue-next";
import { ChatMessage } from "@/types/ChatMessage";

// store
const chatStore = useChatStore();

// data
const chats = computed(() => {
  return chatStore.getChats.filter((chat) => {
    return chat.name.toLowerCase().includes(searchFilter.value.toLowerCase());
  });
});

// other
const searchFilter = ref("");
const emit = defineEmits(["selectChat"]);
const menuVisible = ref(false);
const menuX = ref(0);
const menuY = ref(0);

let clickedChatName = "";

// functions
function deleteChat() {
  chatStore.deleteChat(clickedChatName);
}

function clearChat() {
  const chat = chatStore.getChat(clickedChatName);
  if (!chat) {
    return;
  }
  chat.history = [] as ChatMessage[];
}

function openContextMenu(event: MouseEvent, chatName: string) {
  clickedChatName = chatName;
  event.preventDefault();
  menuX.value = event.clientX;
  menuY.value = event.clientY;
  menuVisible.value = true;

  document.addEventListener("click", closeMenu);
}

function closeMenu() {
  menuVisible.value = false;
  document.removeEventListener("click", closeMenu);
}

function getLastMessageFromChat(chat: Chat) {
  const lastMessageIndex = chat.history.length - 1;
  if (lastMessageIndex < 0) {
    return;
  }
  const lastMessage = chat.history[lastMessageIndex].message;
  return lastMessage.substring(0, 26) + " ...";
}
</script>
<template>
  <div class="flex flex-col border-r-2 border-gray-300 h-full">
    <div class="flex p-2 justify-between items-center">
      <span class="text-sm font-bold">Chats</span>
      <MessageSquarePlus
        class="hover:text-blue-600 cursor-pointer"
        :size="20"
      />
    </div>
    <div class="p-2">
      <input
        class="rounded-md w-full bg-gray-50 px-3 py-1 text-xs border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200"
        v-model="searchFilter"
        type="text"
        placeholder="Search ..."
      />
    </div>

    <div class="flex-1 overflow-y-auto p-2 space-y-1 h-full">
      <div
        v-for="(chat, index) in chats"
        :key="index"
        class="relative flex gap-2 p-2 items-center cursor-pointer hover:bg-gray-100 hover:rounded-md"
        :class="{
          'bg-gray-100 rounded-md': chat.name === chatStore.getSelectedChatName,
        }"
        @click="emit('selectChat', chat.name)"
        @contextmenu.prevent="openContextMenu($event, chat.name)"
      >
        <!-- avatar -->
        <div class="flex-shrink-0">
          <!-- TODO -->
          <!-- <img
            v-if="chat.type === 'CONVERSATION'"
            :src="chat.participants[0].avatar_filename || ''"
            alt="avatar"
            class="w-8 h-8 rounded-full object-cover"
          /> -->
          <div
            class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold uppercase"
          >
            {{ chat.name.charAt(0) }}
          </div>
        </div>

        <!-- chatname and last message -->
        <div class="flex flex-col w-full">
          <span class="font-semibold text-sm text-gray-800">{{
            chat.name
          }}</span>
          <span class="text-gray-500 text-xs truncate max-w-[160px]">
            {{ getLastMessageFromChat(chat) || "..." }}
          </span>
        </div>
      </div>
    </div>

    <!-- right click menu -->
    <div
      v-if="menuVisible"
      class="chatItemMenu"
      :style="{ top: `${menuY}px`, left: `${menuX}px` }"
    >
      <ul>
        <li @click="clearChat()">Clear chat</li>
        <li @click="deleteChat()">Delete chat</li>
      </ul>
    </div>
  </div>
</template>
<style>
.chatItemMenu {
  @apply absolute bg-gray-300 border border-gray-300 rounded p-1 shadow z-50;
}
.chatItemMenu li {
  @apply hover:bg-blue-400 hover:text-white text-black text-xs rounded p-1 cursor-pointer;
}
.tab {
  @apply flex items-center;
  @apply bg-gray-100;
  @apply py-1 px-2;
  @apply text-sm;
  @apply border-b-2 border-gray-400;
}
</style>
