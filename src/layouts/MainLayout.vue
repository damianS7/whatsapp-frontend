<script setup lang="ts">
import FullScreenLoadingSpinner from "@/components/FullScreenLoadingSpinner.vue";
import Sidebar from "@/layouts/SidebarLayout.vue";
import Header from "@/components/HeaderBar.vue";
import { useAppInit } from "@/composables/useAppInit";

const appInit = useAppInit();
</script>
<template>
  <FullScreenLoadingSpinner v-if="!appInit.isInitialized()" />
  <div v-else class="flex flex-col h-screen overflow-hidden">
    <header>
      <Header />
    </header>
    <div class="flex w-full h-full p-6 overflow-hidden sm:max-w-4xl mx-auto">
      <main
        class="flex w-full rounded shadow border-2 border-gray-300 overflow-hidden"
      >
        <div>
          <Sidebar />
        </div>
        <div class="w-full h-full">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>
