<script setup lang="ts">
import { ref, computed } from "vue";
import type { Group } from "@/types/Group";
import type { Chat, ChatType } from "@/types/Chat";
import { useGroupStore } from "@/stores/group";
import { useChatStore } from "@/stores/chat";
import { useCustomerStore } from "@/stores/customer";
import { useRoute, useRouter } from "vue-router";
const customerStore = useCustomerStore();
const router = useRouter();
const groupStore = useGroupStore();
const chatStore = useChatStore();
const groups = computed(() => groupStore.getGroups as Group[]);

function joinGroup(id: number) {
  const group = groupStore.getGroup(id);
  const chat = {
    name: group?.name,
    type: "GROUP",
    history: [],
    participants: [],
  } as Chat;
  chatStore.addChat(chat);
  // TODO setselectedchat
  router.push("/chats");
}
</script>
<template>
  <div class="main-container shadow-none rounded-none">
    <section
      class="sm:flex gap-1 items-center text-2xl font-bold border-b border-gray-300 p-1"
    >
      <h1>Groups</h1>
    </section>

    <section class="container grid grid-cols-1 gap-2">
      <div
        v-for="(group, index) in groups"
        :key="index"
        class="rounded bg-gray-300 p-4 flex justify-between items-start"
      >
        <div class="flex flex-col flex-1">
          <span class="font-semibold">{{ group.name }}</span>
          <span class="text-xs text-gray-700">{{ group.description }}</span>
        </div>

        <button
          @click="joinGroup(group.id)"
          class="btn btn-sm btn-blue ml-4 self-center"
        >
          JOIN
        </button>
      </div>
    </section>
  </div>
</template>
