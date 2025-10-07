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
import { useAuthStore } from "@/stores/auth";
import SidebarLink from "@/components/SidebarLink.vue";
import { defineEmits } from "vue";
const emit = defineEmits(["toggleView"]);

const authStore = useAuthStore();
</script>
<template>
  <nav class="h-full p-2 group w-14 flex flex-col space-y-2">
    <SidebarLink
      @click="emit('toggleView', 'chats')"
      to="/chats"
      :icon="MessageCircle"
      label="Chats"
    />
    <SidebarLink
      @click="emit('toggleView', 'groups')"
      to="/groups"
      :icon="Users"
      label="Groups"
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
    <SidebarLink
      @click.prevent="authStore.logout()"
      to="/auth/login"
      :icon="LogOut"
      label="Logout"
    />
  </nav>
</template>
