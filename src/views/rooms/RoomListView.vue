<script setup lang="ts">
import { ref, computed } from "vue";
import type { Room } from "@/types/Room";
import type { Chat, ChatType } from "@/types/Chat";
import { useRoomStore } from "@/stores/room";
import { useChatStore } from "@/stores/chat";
const roomStore = useRoomStore();
const chatStore = useChatStore();
const rooms = computed(() => roomStore.getRooms as Room[]);

function joinRoom(id: number) {
  const room = roomStore.getRoom(id);
  const chat = {
    name: room?.name,
    type: "ROOM",
    history: [
      {
        sender: "DAMIAN",
        message: "Hey!",
      },
      {
        sender: "RONALD",
        message: "Hello!",
      },
    ],
    participants: [{ name: "RONALD" }],
  } as Chat;
  chatStore.addChat(chat);
}
</script>
<template>
  <div class="main-container shadow-none rounded-none">
    <section
      class="sm:flex gap-1 items-center text-2xl font-bold border-b border-gray-300 p-1 mb-4"
    >
      <h1>Rooms</h1>
    </section>

    <section class="grid grid-cols-1 gap-2">
      <div
        v-for="(room, index) in rooms"
        :key="index"
        class="rounded bg-gray-300 p-4 flex justify-between items-start"
      >
        <div class="flex flex-col flex-1">
          <span class="font-semibold">{{ room.id }} - {{ room.name }}</span>
          <span class="text-xs text-gray-700">{{ room.description }}</span>
        </div>

        <button
          @click="joinRoom(room.id)"
          class="btn btn-sm btn-blue ml-4 self-center"
        >
          JOIN
        </button>
      </div>
    </section>
  </div>
</template>
