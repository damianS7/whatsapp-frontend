<script setup lang="ts">
import { Chat } from "@/types/Chat";
import { computed, defineEmits } from "vue";
import { useChatStore } from "@/stores/chat";
const emit = defineEmits(["selectChat"]);
const chatStore = useChatStore();
const chats = computed(() => chatStore.getChats as Chat[]);

function deleteTab(name: string) {
  chatStore.deleteChat(name);
  // unsuscribe
  //emit("confirm", field.value.value);
}
</script>
<template>
  <div class="border-r-2 border-gray-300">
    <a
      v-for="(chat, index) in chats"
      :key="index"
      href="#"
      @click="emit('selectChat', chat.name)"
    >
      <div class="tab">
        {{ chat.name }} &nbsp;
        <button class="btn btn-xs btn-red" @click="deleteTab(chat.name)">
          &#x2717;
        </button>
      </div>
    </a>
  </div>
</template>
<style>
.tab {
  @apply flex items-center;
  @apply bg-gray-100;
  @apply py-1 px-2;
  @apply text-sm;
  @apply border-b-2 border-gray-400;
}
</style>
