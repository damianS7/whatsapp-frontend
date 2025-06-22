<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { ref, defineEmits, defineProps, Ref } from "vue";
import MessageAlert from "@/components/MessageAlert.vue";
import { MessageType } from "@/types/Message";
import { useGroupStore } from "@/stores/group";
import { Chat } from "@/types/Chat";

// emit
const emit = defineEmits(["hidePanel"]);

// store
const groupStore = useGroupStore();

// message to show
const alert = ref();

// form interface
interface Props {
  chat: Chat;
}
const props = defineProps<Props>();
// TODO: call to endpoint group.members to get the members of the group
</script>
<template>
  <div
    class="grid grid-rows-[auto_1fr] bg-gray-200 absolute overflow-hidden w-full h-full -left-0 min-h-full top-0 transition-all duration-500 transform z-10"
  >
    <section
      class="flex items-center justify-between text-2xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Group members</h1>
      <div class="flex gap-2 items-center">
        <button @click="emit('hidePanel')" class="btn btn-sm btn-blue">
          <ArrowLeft :size="20" />
        </button>
      </div>
    </section>
    <section class="container overflow-auto h-full">
      <MessageAlert class="mb-2" ref="alert" />
      <div
        class="grid grid-cols-1 sm:grid-cols-3 grid-rows-[min-content_max-content] gap-2"
      >
        <div
          v-for="(member, index) in props.chat.participants"
          :key="index"
          class="p-4 w-full bg-gray-300 rounded flex flex-col gap-2"
        >
          <div class="flex items-center gap-2">
            <!-- Avatar -->
            <img
              v-if="member.customerAvatar"
              :src="member.customerAvatar"
              alt="avatar"
              class="w-10 h-10 rounded-full object-cover border"
            />
            <div
              v-else
              class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold uppercase"
            >
              {{ member.customerName.charAt(0) }}
            </div>

            <!-- Nombre y botones -->
            <div class="flex-1 flex flex-col gap-2">
              <p class="text-sm font-medium text-gray-800 truncate">
                {{ member.customerName }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
