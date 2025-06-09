<script setup lang="ts">
import { ref, defineExpose } from "vue";

const visible = ref(false);
const fields = ref({
  password: "",
  confirmPassword: "",
});

let _resolve: (value: string) => void;

// open modal
function open(): Promise<string> {
  visible.value = true;

  return new Promise((resolve) => {
    _resolve = resolve;
  });
}

function submit() {
  visible.value = false;
  if (fields.value.password !== fields.value.confirmPassword) {
    _resolve("");
    return;
  }
  _resolve(fields.value.password);
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
      <h2 class="text-xl font-semibold mb-4">Confirm password</h2>

      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block mb-1">Password</label>
          <input
            type="password"
            v-model="fields.password"
            class="w-full border rounded p-2"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block mb-1">Confirm Password</label>
          <input
            type="password"
            v-model="fields.confirmPassword"
            class="w-full border rounded p-2"
            required
          />
        </div>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="cancel"
            class="bg-gray-300 rounded px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
