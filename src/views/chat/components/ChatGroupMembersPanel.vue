<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { ref, defineEmits, defineProps, computed } from "vue";
import CustomAlert from "@/components/CustomAlert.vue";
import type { Chat } from "@/types/Chat";
import { MessageCircle, UserRoundPlus } from "lucide-vue-next";
import { useContactStore } from "@/stores/contact";
import CustomAvatar from "@/components/CustomAvatar.vue";
import { chatUtils } from "@/utils/chat";
import { useRouter } from "vue-router";
import { useChatStore } from "@/stores/chat";
import type { ChatParticipant } from "@/types/ChatParticipant";
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";
import Button from "@/components/ui/button/Button.vue";
const { isLoggedUser, createPrivateChat } = chatUtils();

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

// Map members to ensure property names match ChatParticipant interface
const participants = computed<ChatParticipant[]>(() => {
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
function addContact(userId: number) {
  contactStore
    .addContact(userId)
    .then(() => {
      alert.value.success("Contact added successfully");
    })
    .catch((error) => {
      alert.value.exception(error);
    });
}

// Open chat with the contact
function openChat(chatMember: ChatParticipant) {
  const chat = createPrivateChat({
    id: 0,
    userId: chatMember.userId,
    name: chatMember.userName,
    avatarUrl: chatMember.avatarUrl,
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
        <Button @click="emit('hidePanel')" size="xs">
          <ArrowLeft :size="20" />
        </Button>
      </div>
    </section>
    <section class="container overflow-auto h-full">
      <CustomAlert class="mb-2" ref="alert" />
      <div
        class="grid grid-cols-1 md:grid-cols-2 grid-rows-[min-content_max-content] gap-2"
      >
        <template v-for="(member, index) in participants" :key="index">
          <div v-if="!isLoggedUser(member.userId)">
            <div class="flex gap-2 p-4 bg-gray-300 rounded">
              <!-- Avatar -->
              <CustomAvatar
                class="h-12 w-12 text-white font-bold text-xl uppercase"
                :src="member.avatarUrl ?? ''"
                :fallback="member.userName"
              />

              <!-- name and Buttons -->
              <div class="flex-1 flex flex-col gap-1">
                <p class="text-sm font-medium text-gray-800 truncate">
                  {{ member.userName }}
                </p>

                <div class="flex gap-1 justify-start">
                  <Button
                    @click="openChat(member)"
                    size="xs"
                    variant="success"
                    title="Open chat"
                  >
                    <MessageCircle :size="16" />
                  </Button>
                  <Button
                    v-if="!contactStore.isContact(member.userId)"
                    @click="addContact(member.userId)"
                    size="xs"
                    variant="default"
                    title="Add contact"
                  >
                    <UserRoundPlus :size="16" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>
