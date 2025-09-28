<script setup lang="ts">
import FullScreenLoadingSpinner from "@/components/FullScreenLoadingSpinner.vue";
import Sidebar from "@/layouts/SidebarLayout.vue";
import Header from "@/components/HeaderBar.vue";
import { useAppInit } from "@/composables/useAppInit";

const appInit = useAppInit();
</script>
<template>
  <FullScreenLoadingSpinner v-if="!appInit.isInitialized()" />
  <main v-else class="flex flex-col h-screen overflow-hidden">
    <header>
      <Header />
    </header>
    <div class="flex h-full p-6 overflow-hidden w-full sm:max-w-4xl mx-auto">
      <div
        class="flex w-full rounded shadow border-2 border-gray-300 overflow-hidden"
      >
        <div>
          <Sidebar />
        </div>
        <div class="container p-0 h-full">
          <router-view />
        </div>
      </div>
    </div>
  </main>
</template>
