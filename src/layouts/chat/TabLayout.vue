<script setup lang="ts">
import { Chat } from "@/types/Chat";
import { computed, defineEmits } from "vue";
import { useChatStore } from "@/stores/chat";
const emit = defineEmits(["selectTab"]);
const chatStore = useChatStore();
const chats = computed(() => chatStore.getChats as Chat[]);

function deleteTab(name: string) {
  chatStore.deleteChat(name);
  // unsuscribe
  //emit("confirm", field.value.value);
}
</script>
<template>
  <div class="flex gap-1 border-b-2 border-gray-300">
    <div v-for="(chat, index) in chats" :key="index" class="tab">
      <a href="#" @click="emit('selectTab', chat.name)">{{ chat.name }}</a>
      &nbsp;
      <button class="btn btn-xs btn-red" @click="deleteTab(chat.name)">
        &#x2717;
      </button>
    </div>
  </div>
</template>
<style>
.tab {
  @apply flex items-center;
  @apply bg-gray-300;
  @apply py-1 px-2;
  @apply text-sm;
}
</style>
