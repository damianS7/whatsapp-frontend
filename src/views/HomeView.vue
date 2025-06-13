<script setup lang="ts">
import { computed } from "vue";
</script>
<template>
  <div class="flex flex-col gap-4">
    <!-- Balance -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 bg-gray-50 gap-4 p-4 shadow rounded"
    >
      <h3 class="font-semibold md:col-span-2">Account balances</h3>
      <div class="flex flex-col my-1 p-1 rounded">
        <div></div>
        <div class="flex justify-between mt-4 py-1 px-4 text-sm">
          <span>Total</span>
          <span class="text-green-600 justify-end"> </span>
        </div>
      </div>
    </div>

    <!-- Accounts and Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex justify-between bg-gray-50 rounded p-4 shadow">
        <span>Accounts</span>
        <span></span>
      </div>
      <div class="flex justify-between bg-gray-50 rounded p-4 shadow">
        <span>Cards</span>
        <span></span>
      </div>
    </div>
  </div>
</template>
