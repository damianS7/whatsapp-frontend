<script setup lang="ts">
import {
  Landmark as Home,
  UserPen as Profile,
  Settings,
  LogOut,
  NotebookTabs,
  Users,
  MessageCircle,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import SidebarLink from "@/components/SidebarLink.vue";
import { ref, defineEmits } from "vue";
const emit = defineEmits(["toggleView"]);

const authStore = useAuthStore();
const router = useRouter();

function logout() {
  authStore.logout(); // tu acción en la store
  router.push("/auth/login"); // redirige al login o donde quieras
}
</script>
<template>
  <nav class="h-full p-2 group w-14 flex flex-col space-y-2">
    <SidebarLink
      @click="emit('toggleView', 'rooms')"
      to="/rooms"
      :icon="Users"
      label="Rooms"
    />
    <SidebarLink
      @click="emit('toggleView', 'contacts')"
      to="/contacts"
      :icon="NotebookTabs"
      label="Contacts"
    />
    <SidebarLink
      @click="emit('toggleView', 'profile')"
      to="/profile"
      :icon="Profile"
      label="Profile"
    />
    <SidebarLink
      @click="emit('toggleView', 'settings')"
      to="/settings"
      :icon="Settings"
      label="Settings"
    />
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
