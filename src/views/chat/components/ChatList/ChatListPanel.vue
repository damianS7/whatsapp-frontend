<script setup lang="ts">
import { ref, computed } from "vue";
import { useChatStore } from "@/stores/chat";
import ChatSearchButton from "@/views/chat/components/ChatSearchButton.vue";
import ChatList from "@/views/chat/components/ChatList/ChatList.vue";

// store
const chatStore = useChatStore();

// data
const chats = computed(() => {
  return chatStore.chats.filter((chat) => {
    return chat.name.toLowerCase().includes(searchFilter.value.toLowerCase());
  });
});

// other
const searchFilter = ref("");
</script>
<template>
  <div class="flex flex-col h-full">
    <div class="flex p-2 gap-1">
      <input
        class="rounded-md w-full bg-gray-50 px-3 py-1 text-xs border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200"
        v-model="searchFilter"
        type="text"
        placeholder="Search ..."
      />
      <ChatSearchButton />
    </div>

    <ChatList :chats />
  </div>
</template>
