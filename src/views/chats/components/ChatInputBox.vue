<script setup lang="ts">
import { useChatStore } from "@/stores/chat";
import Chat from "@/types/Chat";
import { ref, defineProps } from "vue";
const props = defineProps({
  chat: Chat,
});
const chatStore = useChatStore();
const textarea = ref("");
function send() {
  chatStore.appendMessage(props.chat.name, "DAMIAN", textarea.value);
  textarea.value = "";
  return;
}
</script>
<template>
  <div class="overflow-auto p-2 border-t-2 border-gray-300">
    <textarea
      class="w-full h-full p-2"
      v-model="textarea"
      @keypress.enter.prevent
      @keypress.enter="send"
    />
  </div>
</template>
