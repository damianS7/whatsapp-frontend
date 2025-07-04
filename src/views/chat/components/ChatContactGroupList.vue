<script setup lang="ts">
import { ref, computed, defineEmits } from "vue";
import { useChatStore } from "@/stores/chat";
import CustomerAvatar from "@/components/CustomerAvatar.vue";
import { useChat } from "@/composables/useChat";
import { Group } from "@/types/Group";
import { Contact } from "@/types/Contact";
import { useContactStore } from "@/stores/contact";
import { useGroupStore } from "@/stores/group";
import { Chat } from "@/types/Chat";
const { createPrivateChat, createGroupChat } = useChat();
const emit = defineEmits(["toggleContactGroupList"]);

// store
const chatStore = useChatStore();
const groupStore = useGroupStore();
const contactStore = useContactStore();

// data
const groups = computed(() => groupStore.getGroups as Group[]);
const contacts = computed(() => contactStore.getContacts as Contact[]);
const chats = computed(() => {
  const chats = [] as Chat[];

  groups.value.map((group) => {
    chats.push(createGroupChat(group));
  });

  contacts.value.map((contact) => {
    chats.push(createPrivateChat(contact));
  });
  return chats.filter((chat) => {
    return chat.name.toLowerCase().includes(searchFilter.value.toLowerCase());
  });
});

// other
const searchFilter = ref("");

// open an existing chat or create a new one if not exists
function openChat(chat: Chat) {
  const chatExist = chatStore.getChat(chat.id);

  if (!chatExist) {
    chatStore.addChat(chat);
  }

  chatStore.selectChat(chat.id);
  emit("toggleContactGroupList");
}
</script>
<template>
  <div id="contactGroupList">
    <div class="p-2 border-b-2 border-gray-400">
      <input
        class="rounded-md w-full bg-gray-50 px-3 py-1 text-xs border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200"
        v-model="searchFilter"
        type="text"
        placeholder="Search ..."
      />
    </div>

    <div class="flex-1 overflow-y-auto h-full p-1">
      <div
        v-for="(chat, index) in chats"
        :key="index"
        class="relative flex gap-2 p-1 items-center cursor-pointer hover:bg-gray-100 hover:rounded-md"
        @click="openChat(chat)"
      >
        <!-- avatar -->
        <div class="flex-shrink-0">
          <div
            class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold uppercase"
          >
            <CustomerAvatar
              :filename="chat.avatarFilename ?? ''"
              :fallbackString="chat.name"
            />
          </div>
        </div>
        <div class="flex flex-col w-full">
          <span class="font-semibold text-sm text-gray-800">{{
            chat.name
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
#contactGroupList {
  @apply flex flex-col;
  @apply w-52 max-h-64 right-2 top-8 absolute z-10;
  @apply bg-blue-100 p-0 border-2 border-gray-300;
  @apply rounded-br-md rounded-bl-md rounded-tl-md;
}
</style>
