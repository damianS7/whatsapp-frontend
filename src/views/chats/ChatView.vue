<script setup lang="ts">
import ChatInputBox from "@/views/chats/components/ChatInputBox.vue";
import ChatHistory from "@/views/chats/components/ChatHistory.vue";
import ChatList from "@/views/chats/components/ChatList.vue";
import ChatHeader from "@/views/chats/components/ChatHeader.vue";
import RoomUserList from "@/views/chats/components/ChatRoomUserList.vue";
import { useCustomerStore } from "@/stores/customer";
import { ref, watch, onMounted } from "vue";
import { useChatStore } from "@/stores/chat";
import { Chat } from "@/types/Chat";
const chatStore = useChatStore();
const customerStore = useCustomerStore();
const currentChat = ref<Chat | null>(null);

function selectChat(chatName: string) {
  chatStore.selectChat(chatName);
  currentChat.value = chatStore.getSelectedChat;
}

onMounted(() => {
  currentChat.value = chatStore.getSelectedChat;
});
</script>
<template>
  <div class="grid grid-cols-[14rem_1fr] h-full">
    <div class="overflow-hidden">
      <ChatList
        v-if="currentChat"
        :currentChat="currentChat"
        @selectChat="selectChat"
      />
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
        />
      </div>

      <div>
        <ChatInputBox
          :user="customerStore.getLoggedCustomer"
          :chat="currentChat"
        />
      </div>
    </div>
  </div>
</template>
