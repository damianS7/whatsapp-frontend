<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import CustomAvatar from "@/components/CustomAvatar.vue";
const userStore = useUserStore();
</script>
<template>
  <header class="flex justify-end items-center gap-2 w-full p-2 shadow">
    <span class="">
      Welcome
      <b class="uppercase">{{ userStore.user.firstName }}</b>
    </span>

    <span>
      <CustomAvatar
        :src="userStore.user.avatarUrl"
        :fallback="userStore.user.firstName"
        class="rounded-full w-6 h-6 bg-gray-300 text-white font-bold"
      />
    </span>
  </header>
</template>
