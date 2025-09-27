<script setup lang="ts">
import { computed, defineProps } from "vue";
import type { Chat } from "@/types/Chat";
import { useChat } from "@/composables/useChat";
const { getDestinationUser } = useChat();
import CustomerAvatar from "@/components/CustomerAvatar.vue";
interface Props {
  chat: Chat;
}
const props = defineProps<Props>();
const filename = computed(() => {
  let avatarFilename = "";
  if (props.chat.type === "PRIVATE") {
    avatarFilename = getDestinationUser(props.chat)?.userAvatarFilename ?? "";
  }

  if (props.chat.type === "GROUP" && props.chat.avatarFilename) {
    avatarFilename = props.chat.avatarFilename;
  }
  return avatarFilename;
});
</script>
<template>
  <div class="flex items-center gap-2 p-2 border-gray-300">
    <!-- avatar -->
    <div
      class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold uppercase"
    >
      <CustomerAvatar :filename="filename" :fallbackString="chat.name" />
    </div>
    <!-- chat name -->
    <div>
      <h2 class="text-md font-semibold text-gray-800">{{ chat.name }}</h2>
    </div>
  </div>
</template>
