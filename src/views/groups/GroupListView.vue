<script setup lang="ts">
import { ref, computed } from "vue";
import type { Group } from "@/types/Group";
import { useGroupStore } from "@/stores/group";
import { useChatStore } from "@/stores/chat";
import { useRouter } from "vue-router";
import { chatUtils } from "@/utils/chat";
import GroupCreatePanel from "./components/GroupCreatePanel.vue";
import Button from "@/components/ui/button/Button.vue";
import { authUtils } from "@/utils/auth";
const { createGroupChat } = chatUtils();
const { isLoggedUser } = authUtils();

const router = useRouter();
const groupStore = useGroupStore();
const chatStore = useChatStore();
const groups = computed(() => groupStore.groups as Group[]);

// open an existing chat or create a new one if not exists
function openChat(groupId: number) {
  const group = groupStore.getGroup(groupId);
  if (!group) {
    return;
  }

  const chat = createGroupChat(group);
  const chatExist = chatStore.getChat(chat.id);

  if (!chatExist) {
    chatStore.addChat(chat);
  }

  chatStore.selectChat(chat.id);
  router.push("/chats");
}

const createGroupPanelVisible = ref(false);
function toggleCreateGroupPanel() {
  createGroupPanelVisible.value = !createGroupPanelVisible.value;
}
</script>
<template>
  <div
    class="main-container grid grid-rows-[auto_1fr] shadow-none rounded-none overflow-hidden h-full relative"
  >
    <GroupCreatePanel
      :class="createGroupPanelVisible ? 'translate-x-0' : '-translate-x-full'"
      @hidePanel="toggleCreateGroupPanel"
    />

    <section
      class="sm:flex items-center justify-between text-2xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Groups</h1>
      <Button size="xs" @click="toggleCreateGroupPanel"> CREATE GROUP </Button>
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

        <div class="flex gap-1">
          <Button size="xs" v-if="isLoggedUser(group.owner.userId)">
            <router-link :to="`/groups/${group.id}`" class=""
              >EDIT
            </router-link>
          </Button>

          <Button @click="openChat(group.id)" size="xs"> OPEN </Button>
        </div>
      </div>
    </section>
  </div>
</template>
