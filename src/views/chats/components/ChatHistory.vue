<script setup lang="ts">
import { ref, defineProps, onUpdated } from "vue";
import type ChatMessage from "@/types/ChatMessage";
import type { Customer } from "@/types/Customer";
interface Props {
  user: Customer;
  messages: ChatMessage[];
}
const props = defineProps<Props>();
const chatContainer = ref<HTMLElement | null>(null);
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

function customerName() {
  return props.user.profile.firstName;
}
onUpdated(scrollToBottom);
</script>
<template>
  <div
    ref="chatContainer"
    class="overflow-x-hidden overflow-y-auto p-4 space-y-2 h-full"
  >
    <div
      v-for="(message, index) in messages"
      :key="index"
      :class="{
        'flex justify-end': message.senderName === customerName(),
        'flex justify-start': message.senderName !== customerName(),
      }"
    >
      <div
        class="px-6 py-4 min-w-[16rem] shadow"
        :class="{
          'bg-lime-200 rounded-tl-xl rounded-bl-xl rounded-tr-xl':
            message.senderName === customerName(),
          'bg-stone-100 rounded-bl-xl rounded-tr-xl rounded-br-xl':
            message.senderName !== customerName(),
        }"
      >
        <p class="text-base break-words mb-1">
          {{ message.message }}
        </p>
        <p class="text-xs italic text-gray-400 text-right">8:35</p>
      </div>
    </div>
  </div>
</template>
