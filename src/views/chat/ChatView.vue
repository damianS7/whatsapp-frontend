<script setup lang="ts">
import ChatInputBox from "@/views/chat/components/ChatInputBox.vue";
import ChatHistory from "@/views/chat/components/ChatHistory.vue";
import ChatList from "@/views/chat/components/ChatList.vue";
import ChatHeader from "@/views/chat/components/ChatHeader.vue";
import { useCustomerStore } from "@/stores/customer";
import { ref, onMounted } from "vue";
import { useChatStore } from "@/stores/chat";
import { Chat } from "@/types/Chat";
const chatStore = useChatStore();
const customerStore = useCustomerStore();
const currentChat = ref<Chat | null>(null);

function selectChat(chatName: string) {
  chatStore.selectChat(chatName);
  const selectedChat = chatStore.getSelectedChat;
  if (!selectedChat) {
    return;
  }
  currentChat.value = selectedChat;
}

onMounted(() => {
  const selectedChat = chatStore.getSelectedChat;
  if (selectedChat) {
    currentChat.value = selectedChat;
  }
});
</script>
<template>
  <div class="grid grid-cols-[14rem_1fr] h-full">
    <div class="overflow-hidden">
      <ChatList @selectChat="selectChat" />
    </div>

    <div
      v-if="currentChat"
      class="grid grid-rows-[auto_1fr_auto] overflow-hidden h-full"
    >
      <div class="border-b-2 border-gray-300">
        <ChatHeader :chat="currentChat" />
      </div>

      <div class="overflow-hidden">
        <ChatHistory
          :user="customerStore.getLoggedCustomer"
          :messages="currentChat.history"
          :chatType="currentChat.type"
        />
      </div>

      <div>
        <ChatInputBox
          :fromCustomer="customerStore.getLoggedCustomer"
          :chat="currentChat"
        />
      </div>
    </div>
  </div>
</template>
