<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { ref, computed, defineEmits } from "vue";
import MessageAlert from "@/components/MessageAlert.vue";
import { MessageType } from "@/types/Message";
const emit = defineEmits(["hidePanel"]);

// message to show
const alert = ref();
</script>
<template>
  <div
    class="bg-gray-200 absolute w-full h-full -left-0 min-h-full top-0 transition-all duration-500 transform z-10"
  >
    <section
      class="sm:flex items-center justify-between text-2xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Edit Group</h1>
      <button @click="emit('hidePanel')" class="btn btn-sm btn-blue">
        <ArrowLeft />
      </button>
    </section>
    <section class="flex flex-col container gap-2 overflow-auto h-full">
      <div>Group name</div>
      <div>Group members</div>
      <div>Group description</div>
    </section>
  </div>
</template>
