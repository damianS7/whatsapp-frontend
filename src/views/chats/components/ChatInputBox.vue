<script setup lang="ts">
import { useChatStore } from "@/stores/chat";
import type Chat from "@/types/Chat";
import type Customer from "@/types/Customer";
import { ref, defineProps } from "vue";
interface Props {
  user: Customer;
  chat: Chat;
}
const props = defineProps<Props>();

const chatStore = useChatStore();
const textarea = ref("");
function send() {
  chatStore.sendMessage(props.chat.name, {
    senderCustomerId: props.user.id,
    senderName: props.user.profile.firstName,
    message: textarea.value,
  });
  textarea.value = "";
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
