<script setup lang="ts">
import { ref, computed } from "vue";
import type { Group } from "@/types/Group";
import { useGroupStore } from "@/stores/group";
import { useChatStore } from "@/stores/chat";
import { useRouter } from "vue-router";
import MessageAlert from "@/components/MessageAlert.vue";
import CreateGroupPanel from "./components/CreateGroupPanel.vue";
import { useChat } from "@/composables/useChat";
const { isLoggedCustomer, generateChatId } = useChat();
// message to show
const alert = ref();
const router = useRouter();
const groupStore = useGroupStore();
const chatStore = useChatStore();
const groups = computed(() => groupStore.getGroups as Group[]);

// open an existing chat or create a new one if not exists
function openChat(groupId: number) {
  const group = groupStore.getGroup(groupId);
  if (!group) {
    return;
  }
  const chatExist = chatStore.getChat(group.name);
  if (!chatExist) {
    chatStore.addChat({
      id: generateChatId("GROUP", group.id),
      groupId: group.id,
      name: group?.name,
      type: "GROUP",
      history: [],
      participants: [],
    });
  }

  chatStore.selectChat(group.name);
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
    <CreateGroupPanel
      :class="createGroupPanelVisible ? 'translate-x-0' : '-translate-x-full'"
      @hidePanel="toggleCreateGroupPanel"
    />

    <section
      class="sm:flex items-center justify-between text-2xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Groups</h1>
      <button @click="toggleCreateGroupPanel" class="btn btn-sm btn-blue">
        CREATE GROUP
      </button>
    </section>

    <section class="flex flex-col container gap-2 overflow-auto h-full">
      <MessageAlert class="mb-2" ref="alert" />
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
          <!-- TODO: Only show if owner -->
          <router-link
            v-if="isLoggedCustomer(group.owner.customerId)"
            class="btn btn-sm btn-blue self-center"
            :to="`/groups/${group.id}`"
          >
            EDIT
          </router-link>

          <button
            @click="openChat(group.id)"
            class="btn btn-sm btn-blue self-center"
          >
            OPEN
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
