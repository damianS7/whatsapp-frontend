<script setup lang="ts">
import { ref, computed } from "vue";
import type Room from "@/types/Room.ts";
import { useRoomStore } from "@/stores/room";
const roomStore = useRoomStore();
const rooms = computed(() => roomStore.getRooms) as Room[];

function joinRoom(id: number) {
  console.log("Joining room: " + id);
  return;
}
</script>
<template>
  <div class="main-container shadow-none rounded-none">
    <section
      class="sm:flex gap-1 items-center text-2xl font-bold border-b border-gray-300 p-1 mb-4"
    >
      <h1>Rooms</h1>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div
        v-for="(room, index) in rooms"
        :key="index"
        class="rounded bg-gray-300 p-4 flex items-center justify-between"
      >
        <img src="" alt="" class="w-10 h-10 rounded-full bg-white" />
        <span class="ml-2 flex-1">{{ room.name }}</span>
        <button @click="joinRoom(room.id)" class="btn btn-sm btn-blue">
          JOIN
        </button>
      </div>
    </section>
  </div>
</template>
