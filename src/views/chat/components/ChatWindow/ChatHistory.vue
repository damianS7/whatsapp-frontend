<script setup lang="ts">
import { ref, defineProps, onUpdated, onMounted } from "vue";
import type { ChatMessage } from "@/types/ChatMessage";
import type { User } from "@/types/User";
import type { ChatType } from "@/types/Chat";
import { useChat } from "@/composables/useChat";
const { isLoggedUser } = useChat();
interface Props {
  user: User;
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
        'flex justify-center': message.fromUserName === 'SYSTEM',
        'flex justify-end': isLoggedUser(message.fromUserId),
        'flex justify-start': !isLoggedUser(message.fromUserId),
      }"
    >
      <div
        class="px-4 py-2 w-full min-w-32 max-w-min shadow"
        :class="{
          'rounded-xl max-w-max': message.fromUserName === 'SYSTEM',
          'bg-lime-200 rounded-tl-xl rounded-bl-xl rounded-tr-xl': isLoggedUser(
            message.fromUserId
          ),
          'bg-stone-100 rounded-bl-xl rounded-tr-xl rounded-br-xl':
            !isLoggedUser(message.fromUserId),
        }"
      >
        <p
          v-if="chatType === 'GROUP' && message.fromUserName !== 'SYSTEM'"
          class="font-bold"
        >
          {{ message.fromUserName }}
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
