<script setup lang="ts">
import FullScreenLoadingSpinner from "@/components/FullScreenLoadingSpinner.vue";
import Sidebar from "@/layouts/SidebarLayout.vue";
import Header from "@/components/HeaderBar.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useGroupStore } from "@/stores/group";
import { useCustomerStore } from "@/stores/customer";
import { useContactStore } from "@/stores/contact";
import { useChatStore } from "@/stores/chat";
import { useRoute, useRouter } from "vue-router";
const visible = ref(false);
const customerStore = useCustomerStore();
const authStore = useAuthStore();
const groupStore = useGroupStore();
const chatStore = useChatStore();
const contactStore = useContactStore();
const router = useRouter();
const route = useRoute();
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
  await contactStore.initialize();
  await groupStore.initialize();
  await chatStore.initialize();
  initialized.value = true;
});

onUnmounted(() => {
  clearInterval(interval);
});

function toggleView(view: string) {
  const currentView = route.name;
  if (visible.value && currentView !== view) {
    return;
  }
  // visible.value = !visible.value;
}
</script>
<template>
  <FullScreenLoadingSpinner v-if="!initialized" />
  <main v-else class="flex flex-col h-screen">
    <Header />

    <div class="flex flex-1 overflow-hidden p-6">
      <div
        class="flex flex-1 rounded shadow overflow-hidden border-2 border-gray-300"
      >
        <div>
          <Sidebar @toggleView="toggleView" />
        </div>
        <div class="container p-0 flex-1 flex overflow-hidden h-full relative">
          <div
            class="container overflow-auto absolute w-full h-full left-0 min-h-full top-0 transition-all duration-500 transform"
            :class="{
              '-translate-x-full': !visible,
              'translate-x-0': visible,
            }"
          ></div>

          <div class="container p-0 w-full h-full overflow-hidden">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
