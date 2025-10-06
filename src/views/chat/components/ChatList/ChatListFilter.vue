<script setup lang="ts">
import { ref, computed, defineEmits } from "vue";
import { useChatStore } from "@/stores/chat";
import { MessageSquarePlus } from "lucide-vue-next";
import type { ChatMessage } from "@/types/ChatMessage";
import ChatContactGroupList from "./ChatContactGroupList.vue";
import { useContactStore } from "@/stores/contact";
import ChatListItem from "./ChatListItem.vue";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

// store
const chatStore = useChatStore();
const contactStore = useContactStore();

// data
const chats = computed(() => {
  return chatStore.chats.filter((chat) => {
    return chat.name.toLowerCase().includes(searchFilter.value.toLowerCase());
  });
});

// other
const searchFilter = ref("");
const emit = defineEmits(["selectChat"]);
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
    if (selectedChat?.userId) {
      contactStore.addContact(selectedChat.userId);
    }
  }
}

const contactGroupListVisible = ref(false);
function toggleContactGroupList() {
  contactGroupListVisible.value = !contactGroupListVisible.value;
}
</script>
<template>
  <div class="flex flex-col border-r-2 border-gray-300 h-full">
    <div class="flex p-2 justify-between items-center">
      <span class="text-sm font-bold">Chats</span>

      <Popover v-model:open="contactGroupListVisible">
        <PopoverTrigger as-child>
          <button
            :class="{
              'bg-gray-100 p-1 rounded shadow active:translate-y-[1px] active:shadow-inner active:bg-gray-200 transition duration-100':
                contactGroupListVisible,
              'p-1 rounded shadow': !contactGroupListVisible,
            }"
            class="hover:bg-blue-200 cursor-pointer"
          >
            <MessageSquarePlus
              class="hover:text-blue-600 cursor-pointer"
              :size="20"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <ChatContactGroupList
            v-if="contactGroupListVisible"
            @toggleContactGroupList="toggleContactGroupList"
          />
        </PopoverContent>
      </Popover>
    </div>
    <div class="p-2">
      <input
        class="rounded-md w-full bg-gray-50 px-3 py-1 text-xs border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200"
        v-model="searchFilter"
        type="text"
        placeholder="Search ..."
      />
    </div>

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
