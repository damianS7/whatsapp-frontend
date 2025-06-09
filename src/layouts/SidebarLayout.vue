<script setup lang="ts">
import {
  Landmark as Home,
  Wallet as Accounts,
  CreditCard,
  UserPen as Profile,
  Settings,
  LogOut,
  ReceiptText,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import SidebarLink from "@/components/SidebarLink.vue";

const authStore = useAuthStore();
const router = useRouter();

function logout() {
  authStore.logout(); // tu acción en la store
  router.push("/auth/login"); // redirige al login o donde quieras
}
</script>
<template>
  <nav
    class="sidebar p-2 group w-14 hover:sm:w-64 transition-all duration-300 ease-in-out h-screen flex flex-col drop-shadow space-y-2"
  >
    <SidebarLink to="/home" :icon="Home" label="Home" />
    <SidebarLink to="/accounts" :icon="Accounts" label="Accounts" />
    <SidebarLink to="/cards" :icon="CreditCard" label="Cards" />
    <SidebarLink
      to="/transactions"
      :icon="ReceiptText"
      label="Pending transactions"
    />
    <SidebarLink to="/profile" :icon="Profile" label="Profile" />
    <SidebarLink to="/settings" :icon="Settings" label="Settings" />
    <a href="#" @click.prevent="logout">
      <div
        class="flex items-center gap-4 p-2 rounded hover:bg-gray-200 transition-colors"
      >
        <span class="text-lg">
          <LogOut class="w-6 h-6" />
        </span>
        <span
          class="sidebar-label overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:opacity-100 opacity-0"
          >Logout</span
        >
      </div>
    </a>
  </nav>
</template>
