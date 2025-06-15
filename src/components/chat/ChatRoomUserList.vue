<script setup lang="ts">
import { defineProps } from "vue";
defineProps({
  participants: { name: String },
});
</script>
<template>
  <div>
    <p v-for="(participant, index) in participants" :key="index">
      {{ participant.name }}
    </p>
  </div>
</template>
