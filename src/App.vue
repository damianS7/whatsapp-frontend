<template>
  <router-view />
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
onMounted(() => {
  authStore.initialize();
});
</script>
<style>
* {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif;
}

header,
nav,
.container {
  @apply bg-gray-200;
}

nav {
  @apply border-r-2 border-solid border-gray-300;
}

.container {
  @apply p-4;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav a:hover {
  @apply text-blue-500;
}

nav a.router-link-exact-active {
  @apply font-bold;
  @apply text-blue-500;
}

.btn {
  @apply font-bold py-2 px-4 rounded text-sm;
}

.btn-small,
.btn-sm {
  @apply font-bold p-1 px-2 rounded text-xs;
}

.btn-xs {
  @apply font-bold text-xs px-1 py-0 rounded;
}

.btn-blue,
.btn-info {
  @apply bg-blue-600 text-white;
}

.btn-success {
  @apply bg-green-600 text-white;
}

.btn-success:hover {
  @apply bg-green-700 text-white;
}

.btn-blue:hover {
  @apply bg-blue-700;
}

.btn-red {
  @apply bg-red-500 text-white;
}

.btn-red:hover {
  @apply bg-red-600;
}

.pill {
  @apply font-bold text-sm px-2 py-1 rounded-full;
}

.pill-xs {
  @apply font-bold text-xs px-1.5 py-0.5 rounded-full;
}

.pill-blue {
  @apply bg-blue-200 text-blue-800;
}
</style>
