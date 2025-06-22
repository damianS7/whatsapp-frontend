<script setup lang="ts">
import { ref, defineProps, onUpdated, onMounted } from "vue";
import type { ChatMessage } from "@/types/ChatMessage";
import type { Customer } from "@/types/Customer";
import type { ChatType } from "@/types/Chat";
import { useChat } from "@/composables/useChat";
const { isLoggedCustomer } = useChat();
interface Props {
  user: Customer;
  messages: ChatMessage[];
  chatType: ChatType;
}
const props = defineProps<Props>();
const chatContainer = ref<HTMLElement | null>(null);
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};
onUpdated(scrollToBottom);
onMounted(() => {
  scrollToBottom();
});
</script>
<template>
  <div
    ref="chatContainer"
    class="flex-col overflow-x-hidden overflow-y-auto p-4 space-y-2 h-full"
  >
    <div
      v-for="(message, index) in messages"
      :key="index"
      :class="{
        'flex justify-end': isLoggedCustomer(message.fromCustomerId),
        'flex justify-start': !isLoggedCustomer(message.fromCustomerId),
      }"
    >
      <div
        class="px-4 py-2 min-w-[16rem] shadow"
        :class="{
          'bg-lime-200 rounded-tl-xl rounded-bl-xl rounded-tr-xl':
            isLoggedCustomer(message.fromCustomerId),
          'bg-stone-100 rounded-bl-xl rounded-tr-xl rounded-br-xl':
            !isLoggedCustomer(message.fromCustomerId),
        }"
      >
        <p v-if="chatType === 'GROUP'" class="font-bold">
          {{ message.fromCustomerName }}
        </p>
        <p class="text-base break-words mb-1">
          {{ message.message }}
        </p>
        <p class="text-xs italic text-gray-400 text-right">
          {{
            new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          }}
        </p>
      </div>
    </div>
  </div>
</template>
