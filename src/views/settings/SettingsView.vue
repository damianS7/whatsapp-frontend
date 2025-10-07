<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { useChatStore } from "@/stores/chat";
</script>

<template>
  <div class="main-container grid grid-rows-[auto_1fr] h-full">
    <section
      class="flex items-center justify-between text-2xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Settings</h1>
      <Button size="xs">SAVE</Button>
    </section>

    <section class="container">
      <form class="space-y-6">
        <!-- Clear chats -->
        <div class="flex items-center justify-between">
          <label class="text-lg font-medium">Clear chats</label>
          <Button @click="useChatStore().clearChats()" size="xs">Clear</Button>
        </div>
      </form>
    </section>
  </div>
</template>
