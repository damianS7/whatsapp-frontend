<script setup lang="ts">
import ChatInputBox from "@/views/chat/components/ChatInputBox.vue";
import ChatHistory from "@/views/chat/components/ChatHistory.vue";
import ChatList from "@/views/chat/components/ChatList.vue";
import ChatHeader from "@/views/chat/components/ChatHeader.vue";
import { useCustomerStore } from "@/stores/customer";
import { ref, computed } from "vue";
import { useChatStore } from "@/stores/chat";
import ChatGroupMembersPanel from "./components/ChatGroupMembersPanel.vue";
const chatStore = useChatStore();
const customerStore = useCustomerStore();
const currentChat = computed(() => {
  return chatStore.getSelectedChat;
});

function selectChat(chatId: string) {
  chatStore.selectChat(chatId);
}
const groupMemberPanelVisible = ref(false);
function toggleGroupMemberPanel() {
  groupMemberPanelVisible.value = !groupMemberPanelVisible.value;
}
</script>
<template>
  <div class="grid grid-cols-[14rem_1fr] h-full">
    <div class="hidden md:block overflow-hidden">
      <ChatList @selectChat="selectChat" />
    </div>

    <div
      v-if="currentChat"
      class="grid grid-rows-[auto_1fr_auto] overflow-hidden h-full relative"
    >
      <ChatGroupMembersPanel
        v-if="currentChat.type === 'GROUP'"
        :class="groupMemberPanelVisible ? 'translate-x-0' : '-translate-x-full'"
        @hidePanel="toggleGroupMemberPanel"
        :chat="currentChat"
      />
      <div
        @click="toggleGroupMemberPanel"
        class="border-b-2 border-gray-300 cursor-pointer"
      >
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
