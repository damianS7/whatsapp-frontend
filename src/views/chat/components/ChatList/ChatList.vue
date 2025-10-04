<script setup lang="ts">
import { ref } from "vue";
import { useChatStore } from "@/stores/chat";
import type { ChatMessage } from "@/types/ChatMessage";
import { useChat } from "@/composables/useChat";
import { useContactStore } from "@/stores/contact";
import ChatListItem from "./ChatListItem.vue";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { Chat } from "@/types/Chat";
const { getDestinationUser } = useChat();

defineProps<{
  chats: Chat[];
}>();

// store
const chatStore = useChatStore();
const contactStore = useContactStore();

// other
const menuVisible = ref(false);

function openContextMenu() {
  menuVisible.value = true;
}
// functions
function deleteChat() {
  const selectedChat = chatStore.getSelectedChat;
  if (selectedChat) {
    chatStore.deleteChat(selectedChat.id);
  }
}

function clearChat() {
  const selectedChat = chatStore.getSelectedChat;
  if (selectedChat) {
    selectedChat.history = [] as ChatMessage[];
  }
}

function isContact() {
  // const chat = chatStore.getChat(clickedChatId);
  // if (chat && chat.type === "PRIVATE") {
  //   const destUser = getDestinationUser(chat);
  //   if (destUser?.userId) {
  //     return contactStore.isContact(destUser.userId);
  //   }
  // }
  // return true;
}

function addContact() {
  // TODO
  // const chat = chatStore.getSelectedChat();
  const selectedChat = chatStore.getSelectedChat;
  if (!selectedChat) {
    return;
  }

  if (selectedChat && selectedChat.type === "PRIVATE") {
    const destUser = getDestinationUser(selectedChat);
    if (destUser?.userId) {
      contactStore.addContact(destUser.userId);
    }
  }
}
</script>
<template>
  <div class="flex flex-col border-r-2 border-gray-300 h-full">
    <div class="overflow-y-auto p-2 h-full">
      <ContextMenu v-model:open="menuVisible">
        <ContextMenuTrigger class="flex flex-col gap-1">
          <ChatListItem
            @openMenu="openContextMenu"
            v-for="(chat, index) in chats"
            :key="index"
            :chat
          />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem @click="addContact">Add to contacts</ContextMenuItem>
          <ContextMenuItem @click="clearChat">Clear chat</ContextMenuItem>
          <ContextMenuItem @click="deleteChat">Delete chat</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  </div>
</template>
