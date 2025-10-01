<script setup lang="ts">
import { defineProps } from "vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const props = defineProps<{
  src?: string;
  fallback?: string;
}>();
</script>
<template>
  <Avatar>
    <AvatarImage v-if="src" :src />
    <AvatarFallback v-if="fallback" class="bg-blue-500">{{
      fallback.charAt(0)
    }}</AvatarFallback>
  </Avatar>
</template>
