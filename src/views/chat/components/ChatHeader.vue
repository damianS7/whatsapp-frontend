<script setup lang="ts">
import { defineProps } from "vue";
import { useChatStore } from "@/stores/chat";
import type Chat from "@/types/Chat";
import type Customer from "@/types/Customer";
const chatStore = useChatStore();
interface Props {
  chat: Chat;
}
const props = defineProps<Props>();
</script>
<template>
  <div class="flex items-center gap-2 p-2 border-gray-300">
    <!-- avatar -->
    <div
      class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold uppercase"
    >
      {{ chat.name.charAt(0) }}
    </div>

    <!-- chat name -->
    <div>
      <h2 class="text-md font-semibold text-gray-800">{{ chat.name }}</h2>
    </div>
  </div>
</template>
