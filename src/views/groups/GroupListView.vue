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
  if (group) {
    chatStore.selectChat(group.name);
    router.push("/chats");
    return;
  }
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

const visible = ref(false);
function toggleView(view: string) {
  // const currentView = route.name;
  // if (visible.value && currentView !== view) {
  //   return;
  // }
  visible.value = !visible.value;
}
</script>
<template>
  <div
    class="main-container grid shadow-none rounded-none overflow-hidden h-full"
  >
    <div
      class="bg-gray-200 absolute w-full h-full -left-0 min-h-full top-0 transition-all duration-500 transform z-10"
      :class="visible ? 'translate-x-0' : '-translate-x-full'"
    ></div>
    <section
      class="sm:flex items-center justify-between text-2xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Groups</h1>
      <button @click="toggleView" class="btn btn-sm btn-blue">
        CREATE GROUP
      </button>
    </section>

    <section class="flex flex-col container gap-2 overflow-auto h-full">
      <div
        v-for="(group, index) in groups"
        :key="index"
        class="rounded bg-gray-300 p-4 flex justify-between items-center"
      >
        <div class="flex flex-col flex-1">
          <span class="font-semibold">{{ group.name }}</span>
          <span class="text-xs text-gray-700">{{ group.description }}</span>
        </div>

        <!-- TODO: Only show if admin -->
        <div class="flex gap-1">
          <button
            @click="joinGroup(group.id)"
            class="btn btn-sm btn-red self-center"
          >
            DELETE
          </button>
          <button
            @click="joinGroup(group.id)"
            class="btn btn-sm btn-blue self-center"
          >
            JOIN
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
