<script setup lang="ts">
import ChatInputBox from "@/views/chat/components/ChatWindow/ChatInputBox.vue";
import ChatHistory from "@/views/chat/components/ChatWindow/ChatHistory.vue";
import ChatHeader from "@/views/chat/components/ChatWindow/ChatHeader.vue";
import { useUserStore } from "@/stores/user";
import { ref, computed } from "vue";
import { useChatStore } from "@/stores/chat";
import ChatGroupMembersPanel from "@/views/chat/components/ChatGroupMembersPanel.vue";
import ChatListPanel from "@/views/chat/components/ChatList/ChatListPanel.vue";
const chatStore = useChatStore();
const userStore = useUserStore();
const currentChat = computed(() => {
  return chatStore.getSelectedChat;
});

const groupMemberPanelVisible = ref(false);
function toggleGroupMemberPanel() {
  groupMemberPanelVisible.value = !groupMemberPanelVisible.value;
}
</script>
<template>
  <div class="grid grid-cols-[14rem_1fr] h-full">
    <div class="md:block overflow-hidden border-r-2 border-gray-300">
      <ChatListPanel />
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
          :user="userStore.getLoggedUser"
          :messages="currentChat.history"
          :chatType="currentChat.type"
        />
      </div>

      <div>
        <ChatInputBox :fromUser="userStore.getLoggedUser" :chat="currentChat" />
      </div>
    </div>
  </div>
</template>
