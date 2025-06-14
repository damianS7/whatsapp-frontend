<script setup lang="ts">
import { computed } from "vue";
const friends = [
  {
    name: "John",
  },
  {
    name: "Donald",
  },
  {
    name: "Marie",
  },
  {
    name: "David",
  },
  {
    name: "Malcom",
  },
  {
    name: "John",
  },
  {
    name: "Donald",
  },
  {
    name: "Marie",
  },
  {
    name: "David",
  },
  {
    name: "Malcom",
  },
  {
    name: "John",
  },
  {
    name: "Donald",
  },
  {
    name: "Marie",
  },
  {
    name: "David",
  },
  {
    name: "Malcom",
  },
  {
    name: "John",
  },
  {
    name: "Donald",
  },
  {
    name: "Marie",
  },
  {
    name: "David",
  },
  {
    name: "Malcom",
  },
  {
    name: "John",
  },
  {
    name: "Donald",
  },
  {
    name: "Marie",
  },
  {
    name: "David",
  },
  {
    name: "Malcom",
  },
  {
    name: "John",
  },
  {
    name: "Donald",
  },
  {
    name: "Marie",
  },
  {
    name: "David",
  },
  {
    name: "Malcom",
  },
];

function deleteFriend(id: string) {
  console.log(id);
}
</script>
<template>
  <div class="main-container shadow-none rounded-none">
    <section
      class="sm:flex gap-1 items-center text-2xl font-bold border-b border-gray-300 p-1 mb-4"
    >
      <h1>Friends</h1>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div
        v-for="(friend, index) in friends"
        :key="index"
        class="rounded bg-gray-300 p-4 flex items-center justify-between"
      >
        <img src="" alt="" class="w-10 h-10 rounded-full bg-white" />
        <span class="ml-2 flex-1">{{ friend.name }}</span>
        <button @click="deleteFriend" class="btn btn-sm btn-red">-</button>
      </div>
    </section>
  </div>
</template>
