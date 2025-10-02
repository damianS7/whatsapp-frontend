<script setup lang="ts">
import { defineEmits, ref } from "vue";
import { useUserStore } from "@/stores/user";
import CustomAvatar from "@/components/CustomAvatar.vue";
const emit = defineEmits(["update", "close"]);
const userStore = useUserStore();
const fileInput = ref<HTMLInputElement | null>(null);
// it shows the file chooser dialog
function showFileChooserDialog() {
  fileInput.value?.click();
}

// updates the photo when a file is selected
function updatePhoto(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  emit("update", file);

  // Reset the input value to allow re-uploading the same file
  target.value = "";
}
</script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
    <div class="md:col-span-2">
      <input type="file" ref="fileInput" class="hidden" @change="updatePhoto" />
      <CustomAvatar
        v-if="userStore.user?.avatarUrl"
        :src="userStore.user.avatarUrl"
        :fallback="userStore.user.firstName"
        alt="Profile photo"
        @click="showFileChooserDialog"
        class="w-24 h-24 rounded-full object-cover border cursor-pointer"
      />
      <div
        v-else
        @click="showFileChooserDialog"
        class="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 cursor-pointer"
      >
        No Image
      </div>
    </div>
  </div>
</template>
