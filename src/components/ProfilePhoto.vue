<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const profileImgURL = ref("");

onMounted(() => {
  if (userStore.user.avatarFilename) {
    reloadProfileImg();
  }
});

watch(
  () => userStore.user.avatarFilename,
  () => {
    reloadProfileImg();
  },
  { immediate: true }
);

// updates the photoUrl
function reloadProfileImg() {
  const profilePhotoURL = localStorage.getItem("profilePhotoURL");
  if (profilePhotoURL) {
    profileImgURL.value = profilePhotoURL;
  }
}
</script>
<template>
  <img v-if="profileImgURL" :src="profileImgURL" />
  <div v-else class="bg-gray-300"></div>
</template>
