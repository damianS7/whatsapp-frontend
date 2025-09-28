<script setup lang="ts">
import { ref, onMounted, defineProps, onUpdated } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const blobURL = ref("");
const props = defineProps<{
  userId: number;
  fallbackString: string;
}>();

function validateImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
}

async function loadBlobURL() {
  if (!props.userId) {
    return;
  }

  // find the avatar in localStorage
  let storedBlobURL = localStorage.getItem(`avatar-${props.userId}`) as
    | string
    | undefined;

  // check if the img works
  if (storedBlobURL) {
    if (!(await validateImage(storedBlobURL))) {
      storedBlobURL = undefined;
    }
  }

  // if the avatar its not in localstorage, fetch it from the server
  if (!storedBlobURL) {
    await userStore
      .getPhoto(props.userId)
      .then((blob) => {
        localStorage.setItem(
          `avatar-${props.userId}`,
          URL.createObjectURL(blob)
        );
      })
      .catch(() => {
        return undefined;
      });
  }

  blobURL.value = localStorage.getItem(`avatar-${props.userId}`) as string;
}

onMounted(async () => {
  await loadBlobURL();
});

onUpdated(async () => {
  await loadBlobURL();
});
</script>
<template>
  <img
    v-if="userId && blobURL"
    :src="blobURL"
    @error="(e: any) => (e.target.src = '/default-avatar.jpg')"
    alt="Profile photo"
    class="rounded-full object-cover min-w-10 min-h-10 aspect-square max-h-16 max-w-16 bg-blue-500"
  />
  <span class="bg-blue-500 rounded-full" v-else>{{
    fallbackString.charAt(0)
  }}</span>
</template>
