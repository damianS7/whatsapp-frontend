<script setup lang="ts">
import { ref } from "vue";
import { useChatStore } from "@/stores/chat";
const chatStore = useChatStore();
const textarea = ref("");
function send() {
  const selectedTab = "name";
  chatStore.appendMessage("Friends", "DAMIAN", textarea.value);
  textarea.value = "";
  return;
}
</script>
<template>
  <div class="overflow-auto p-4 border-t-2 border-gray-300">
    <textarea
      class="w-full h-full p-2"
      v-model="textarea"
      @keypress.enter.prevent
      @keypress.enter="send"
    />
  </div>
</template>
