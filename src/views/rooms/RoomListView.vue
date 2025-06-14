<script setup lang="ts">
import { ref, computed } from "vue";
import type Room from "@/types/Room.ts";
import { useRoomStore } from "@/stores/room";
const roomStore = useRoomStore();
const rooms = computed(() => roomStore.getRooms as Room[]);

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

    <section class="grid grid-cols-1 gap-2">
      <div
        v-for="(room, index) in rooms"
        :key="index"
        class="rounded bg-gray-300 p-4 flex justify-between items-start"
      >
        <!-- Nombre y descripción en columna -->
        <div class="flex flex-col flex-1">
          <span class="font-semibold">{{ room.name }}</span>
          <span class="text-xs text-gray-700">{{ room.description }}</span>
        </div>

        <!-- Botón a la derecha -->
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
