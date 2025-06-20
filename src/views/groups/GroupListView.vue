<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { ref, computed } from "vue";
import type { Group } from "@/types/Group";
import type { Chat, ChatType } from "@/types/Chat";
import { useGroupStore } from "@/stores/group";
import { useChatStore } from "@/stores/chat";
import { useRouter } from "vue-router";
import MessageAlert from "@/components/MessageAlert.vue";
import { MessageType } from "@/types/Message";
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
      name: group?.name,
      type: "GROUP",
      history: [],
      participants: [],
    });
  }

  chatStore.selectChat(group.name);
  router.push("/chats");
}

const createGroupVisible = ref(false);
function showCreateGroup() {
  createGroupVisible.value = !createGroupVisible.value;
}
</script>
<template>
  <div
    class="main-container grid shadow-none rounded-none overflow-hidden h-full relative"
  >
    <div
      class="bg-gray-200 absolute w-full h-full -left-0 min-h-full top-0 transition-all duration-500 transform z-10"
      :class="createGroupVisible ? 'translate-x-0' : '-translate-x-full'"
    >
      <section
        class="sm:flex items-center justify-between text-2xl font-bold border-b border-gray-300 p-1 px-2"
      >
        <h1>Create Group</h1>
        <button @click="showCreateGroup" class="btn btn-sm btn-blue">
          <ArrowLeft />
        </button>
      </section>
      <section class="flex flex-col container gap-2 overflow-auto h-full">
        <div>Group name</div>
        <div>Group members</div>
        <div>Group description</div>
      </section>
    </div>
    <section
      class="sm:flex items-center justify-between text-2xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Groups</h1>
      <button @click="showCreateGroup" class="btn btn-sm btn-blue">
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

        <!-- TODO: Only show if admin -->
        <div class="flex gap-1">
          <button
            @click="openChat(group.id)"
            class="btn btn-sm btn-red self-center"
          >
            DELETE
          </button>
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
