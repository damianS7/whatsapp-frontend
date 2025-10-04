<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { ref, defineEmits, defineProps, computed } from "vue";
import CustomAlert from "@/components/CustomAlert.vue";
import type { Chat } from "@/types/Chat";
import { MessageCircle, UserRoundPlus } from "lucide-vue-next";
import { useContactStore } from "@/stores/contact";
import CustomAvatar from "@/components/CustomAvatar.vue";
import { useChat } from "@/composables/useChat";
import { useRouter } from "vue-router";
import { useChatStore } from "@/stores/chat";
import type { ChatMember } from "@/types/ChatParticipant";
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";
const { isLoggedUser, createPrivateChat } = useChat();

// router
const router = useRouter();

// emit
const emit = defineEmits(["hidePanel"]);

// store
const userStore = useUserStore();
const chatStore = useChatStore();
const contactStore = useContactStore();
const groupStore = useGroupStore();

// message to show
const alert = ref();

// form interface
interface Props {
  chat: Chat;
}

// Map members to ensure property names match ChatMember interface
const participants = computed<ChatMember[]>(() => {
  const group = groupStore.getGroup(props.chat.groupId ?? -1);
  // TODO check this
  // return group?.members ?? [];
  return (group?.members ?? []).map((member: any) => ({
    ...member,
    userAvatarFilename: member.userAvatarFilename ?? member.avatarFilename,
  }));
});

const props = defineProps<Props>();
// TODO: call to endpoint group.members to get the members of the group
function addContact(customerId: number) {
  contactStore
    .addContact(customerId)
    .then(() => {
      alert.value.success("Contact added successfully");
    })
    .catch((error) => {
      alert.value.exception(error);
    });
}

// Open chat with the contact
function openChat(chatMember: ChatMember) {
  const chat = createPrivateChat({
    id: 0,
    userId: chatMember.userId,
    name: chatMember.userName,
    avatarUrl: chatMember.userAvatarFilename,
  });
  const existingChat = chatStore.getChat(chat.id);

  // if the chat not exists, create a new one
  if (!existingChat) {
    chatStore.addChat(chat);
  }

  // select the chat created or existing
  chatStore.selectChat(chat.id);

  // redirect to the chat view
  router.push("/chats");
}
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
      <CustomAlert class="mb-2" ref="alert" />
      <div
        class="grid grid-cols-1 sm:grid-cols-2 grid-rows-[min-content_max-content] gap-2"
      >
        <template v-for="(member, index) in participants" :key="index">
          <div v-if="!isLoggedUser(member.userId)">
            <div
              class="flex flex-col flex-1 items-center gap-1 bg-gray-300 p-4 rounded"
            >
              <!-- Avatar -->
              <div
                class="flex items-center justify-center text-white font-bold uppercase"
              >
                <CustomAvatar :fallback="member.userName ?? ''" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800 truncate">
                  {{ member.userName }}
                </p>
              </div>

              <!-- Nombre y botones -->
              <div class="flex-1 flex flex-col gap-1">
                <button
                  @click="openChat(member)"
                  class="btn btn-primary btn-xs p-2"
                  title="Private chat"
                >
                  <MessageCircle :size="20" />
                </button>
                <button
                  v-if="!contactStore.isContact(member.userId)"
                  @click="addContact(member.userId)"
                  class="btn btn-primary btn-xs p-2"
                  title="add contact"
                >
                  <UserRoundPlus :size="20" />
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>
