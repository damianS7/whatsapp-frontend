<script setup lang="ts">
import { defineProps } from "vue";
import type { Chat } from "@/types/Chat";
import CustomAvatar from "@/components/CustomAvatar.vue";
defineProps<{
  chat: Chat;
}>();
</script>
<template>
  <div class="flex items-center gap-2 p-2 border-gray-300">
    <!-- avatar -->
    <div class="w-8 h-8 text-white font-bold">
      <CustomAvatar :key="chat.id" :src="chat.imageUrl" :fallback="chat.name" />
    </div>
    <!-- chat name -->
    <div>
      <h2 class="text-md font-semibold text-gray-800">
        {{ chat.name }}
      </h2>
    </div>
  </div>
</template>
