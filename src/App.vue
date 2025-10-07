<script setup lang="ts">
import ModalManager from "@/components/modal/ModalManager.vue";
</script>
<template>
  <ModalManager />
  <router-view />
</template>
<style>
@reference "tailwindcss";

* {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    "Noto Sans",
    sans-serif;
}

header,
nav,
main {
  @apply bg-zinc-200;
}

.container {
  @apply p-4;
}

nav {
  @apply border-r-2 border-solid border-zinc-300;
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
</style>
