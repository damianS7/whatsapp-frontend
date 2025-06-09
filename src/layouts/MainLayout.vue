<script setup lang="ts">
import FullScreenLoadingSpinner from "@/components/FullScreenLoadingSpinner.vue";
import Sidebar from "@/layouts/SidebarLayout.vue";
import Header from "@/components/HeaderBar.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useCustomerStore } from "@/stores/customer";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
const authStore = useAuthStore();
const customerStore = useCustomerStore();
const router = useRouter();
const tokenValidationInterval = 30 * 1000; // 30s
let interval: number;
let initialized = ref(false);

async function checkIfTokenIsValid() {
  const token = authStore.token;
  await authStore.isTokenValid(token).catch(async () => {
    initialized.value = false;
    await authStore.logout();
    await wait(100);
    router.push("/auth/login");
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function wait(ms: number) {
  await sleep(ms); // Espera 2 segundos
}

onMounted(async () => {
  interval = setInterval(async () => {
    await checkIfTokenIsValid();
  }, tokenValidationInterval);

  await customerStore.initialize();
  initialized.value = true;
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
<template>
  <FullScreenLoadingSpinner v-if="!initialized" />
  <div v-if="initialized" class="flex h-screen overflow-hidden">
    <!-- Sidebar fijo -->
    <Sidebar />

    <!-- Contenedor principal -->
    <div class="flex-1 flex flex-col">
      <!-- Header fijo -->
      <Header />

      <!-- Contenido scrollable -->
      <div class="flex-1 overflow-auto p-6">
        <router-view />
      </div>
    </div>
  </div>
</template>
