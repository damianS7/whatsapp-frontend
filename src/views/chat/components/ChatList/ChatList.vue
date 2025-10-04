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

function addContact() {
  const selectedChat = chatStore.getSelectedChat;
  if (!selectedChat) {
    return;
  }

  if (selectedChat.type === "PRIVATE") {
    const destUser = getDestinationUser(selectedChat);
    if (destUser?.userId && !contactStore.isContact(destUser.userId)) {
      contactStore.addContact(destUser.userId);
    }
  }
}

function isContact() {
  const selectedChat = chatStore.getSelectedChat;
  if (!selectedChat) {
    return false;
  }

  if (selectedChat.type === "PRIVATE") {
    const destUser = getDestinationUser(selectedChat);
    if (destUser?.userId && contactStore.isContact(destUser.userId)) {
      return true;
    }
  }

  return false;
}
</script>
<template>
  <div class="flex flex-col h-full">
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
          <ContextMenuItem v-if="!isContact()" @click="addContact"
            >Add to contacts</ContextMenuItem
          >
          <ContextMenuItem @click="clearChat">Clear chat</ContextMenuItem>
          <ContextMenuItem @click="deleteChat">Delete chat</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  </div>
</template>
