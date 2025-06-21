<script setup lang="ts">
import { ref, defineExpose } from "vue";
let message = "";
const visible = ref(false);
let _resolve: (value: boolean) => void;

// open modal
function open(msg: string): Promise<boolean> {
  message = msg;
  visible.value = true;

  return new Promise((resolve) => {
    _resolve = resolve;
  });
}

function submit() {
  visible.value = false;
  _resolve(true);
}
function cancel() {
  visible.value = false;
  _resolve(false);
}
defineExpose({ open });
</script>
<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Confirm</h2>
      <div class="mb-4">
        <p>{{ message }}</p>
      </div>

      <div class="flex justify-end gap-2">
        <button type="button" @click="cancel" class="btn btn-secondary">
          CANCEL
        </button>
        <button type="button" @click="submit" class="btn btn-primary">
          CONFIRM
        </button>
      </div>
    </div>
  </div>
</template>
