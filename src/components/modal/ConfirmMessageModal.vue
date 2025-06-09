<script setup lang="ts">
import { ref, defineExpose } from "vue";
let message = "";
const visible = ref(false);
let _resolve: (value: string) => void;

// open modal
function open(msg: string): Promise<string> {
  message = msg;
  visible.value = true;

  return new Promise((resolve) => {
    _resolve = resolve;
  });
}

function submit() {
  visible.value = false;
  _resolve("");
}
function cancel() {
  visible.value = false;
  _resolve("");
}
defineExpose({ open });
</script>
<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Info</h2>
      <div class="mb-4">
        <p>{{ message }}</p>
      </div>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="submit"
          class="bg-gray-300 rounded px-4 py-2"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>
