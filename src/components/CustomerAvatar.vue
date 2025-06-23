<script setup lang="ts">
import { ref, onMounted, defineProps, onUpdated } from "vue";
import { useCustomerStore } from "@/stores/customer";

const customerStore = useCustomerStore();
const blobURL = ref("");
const props = defineProps<{
  filename: string;
  fallbackString: string;
}>();

async function loadBlobURL() {
  if (!props.filename) {
    return;
  }

  // find the avatar in localStorage
  let storedBlobURL = localStorage.getItem(
    `avatar-${props.filename}`
  ) as string;

  // if the avatar its not in localstorage, fetch it from the server
  if (!storedBlobURL) {
    await customerStore
      .getPhoto(props.filename)
      .then((blob) => {
        localStorage.setItem(
          `avatar-${props.filename}`,
          URL.createObjectURL(blob)
        );
      })
      .catch(() => {
        return undefined;
      });
  }

  blobURL.value = localStorage.getItem(`avatar-${props.filename}`) as string;
}

onMounted(async () => {
  await loadBlobURL();
});

onUpdated(async () => {
  await loadBlobURL();
});
</script>
<template>
  <img class="rounded-full" v-if="filename && blobURL" :src="blobURL" />
  <span v-else>{{ fallbackString.charAt(0) }}</span>
</template>
