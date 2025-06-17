<script setup lang="ts">
import { Chat } from "@/types/Chat";
import { ref, onMounted, computed, defineEmits, defineProps } from "vue";
import { useChatStore } from "@/stores/chat";
interface Props {
  currentChat: Chat;
}
const props = defineProps<Props>();

const emit = defineEmits(["selectChat"]);
const chatStore = useChatStore();
const chats = computed(() => chatStore.getChats as Chat[]);

function deleteTab(name: string) {
  chatStore.deleteChat(name);
  // unsuscribe
  //emit("confirm", field.value.value);
}

const menuVisible = ref(false);
const menuX = ref(0);
const menuY = ref(0);

function openContextMenu(event: MouseEvent) {
  event.preventDefault();
  console.log(event.clientX);
  menuX.value = event.clientX;
  menuY.value = event.clientY;
  menuVisible.value = true;

  // Cerrar si haces clic fuera
  document.addEventListener("click", closeMenu);
}

function closeMenu() {
  menuVisible.value = false;
  document.removeEventListener("click", closeMenu);
}

function getLastMessageFromChat(chat: Chat) {
  const lastMessageIndex = chat.history.length - 1;
  if (lastMessageIndex < 0) {
    return;
  }
  const lastMessage = chat.history[lastMessageIndex].message;
  return lastMessage.substring(0, 5) + " ...";
}
onMounted(() => {
  // ...
});
</script>
<template>
  <div class="border-r-2 border-gray-300 overflow-y-auto relative">
    <div
      v-for="(chat, index) in chats"
      :key="index"
      class="flex gap-2 p-2 items-center cursor-pointer hover:bg-gray-100 relative"
      @click="emit('selectChat', chat.name)"
      @contextmenu.prevent="openContextMenu($event, chat.name)"
    >
      <!-- avatar -->
      <div class="flex-shrink-0">
        <img
          v-if="chat.avatarUrl"
          :src="chat.avatarUrl || ''"
          alt="avatar"
          class="w-8 h-8 rounded-full object-cover"
        />
        <div
          class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold uppercase"
        >
          {{ chat.name.charAt(0) }}
        </div>
      </div>

      <!-- chatname and last message -->
      <div class="flex flex-col w-full">
        <span class="font-semibold text-sm text-gray-800">{{ chat.name }}</span>
        <span class="text-gray-500 text-xs truncate max-w-[160px]">
          {{ getLastMessageFromChat(chat) || "..." }}
        </span>
      </div>
    </div>

    <!-- right click menu -->
    <div
      v-if="menuVisible"
      class="absolute bg-white border border-gray-300 rounded shadow p-2 z-50"
      :style="{ top: `${menuY}px`, left: `${menuX}px` }"
    >
      <ul>
        <li
          class="hover:bg-red-100 text-sm text-red-600 rounded px-2 py-1 cursor-pointer"
          @click.stop="deleteTab(chat.name)"
        >
          Eliminar chat ✖
        </li>
      </ul>
    </div>
  </div>
</template>
<style>
.tab {
  @apply flex items-center;
  @apply bg-gray-100;
  @apply py-1 px-2;
  @apply text-sm;
  @apply border-b-2 border-gray-400;
}
</style>
