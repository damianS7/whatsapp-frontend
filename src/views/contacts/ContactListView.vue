<script setup lang="ts">
import { Contact } from "@/types/Contact";
import { useContactStore } from "@/stores/contact";
import { ref, computed } from "vue";
import { useChatStore } from "@/stores/chat";
import { Chat } from "@/types/Chat";
import { MessageCircle, UserRoundMinus } from "lucide-vue-next";
import { useRouter } from "vue-router";
import MessageAlert from "@/components/MessageAlert.vue";
import { MessageType } from "@/types/Message";
import ConfirmMessageModal from "@/components/modal/ConfirmMessageModal.vue";

// modals to show
const modals = {
  confirmMessage: ref(),
};

const router = useRouter();
const chatStore = useChatStore();
const contactStore = useContactStore();
const contacts = computed(() => contactStore.getContacts as Contact[]);
// message to show
const alert = ref();
function openChat(chatName: string) {
  const existingChat = chatStore.getChat(chatName);
  if (!existingChat) {
    chatStore.addChat({
      name: chatName,
      type: "CONVERSATION",
      history: [],
      participants: [{ name: chatName }],
    } as Chat);
  }

  chatStore.selectChat(chatName);
  router.push("/chats");
}

async function deleteContact(id: number) {
  const confirm = await modals.confirmMessage.value.open(
    "Are you sure you want to delete this contact?"
  );
  if (!confirm) {
    return;
  }
  contactStore
    .deleteContact(id)
    .then(() => {
      alert.value.showMessage("Deleted contact.", MessageType.SUCCESS);
    })
    .catch((error) => {
      alert.value.showMessage(error.message, MessageType.ERROR);
    });
}
</script>
<template>
  <div
    class="main-container grid grid-rows-[auto_1fr] shadow-none rounded-none overflow-hidden h-full"
  >
    <ConfirmMessageModal :ref="modals.confirmMessage" />
    <section
      class="sm:flex items-center justify-between text-2xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Contacts</h1>
    </section>

    <section class="container overflow-auto h-full">
      <MessageAlert class="mb-2" ref="alert" />
      <div
        class="grid grid-cols-1 sm:grid-cols-3 grid-rows-[min-content_max-content] gap-2"
      >
        <div
          v-for="(contact, index) in contacts"
          :key="index"
          class="p-4 w-full bg-gray-300 rounded flex flex-col gap-2"
        >
          <div class="flex items-center gap-2">
            <!-- Avatar -->
            <img
              v-if="contact.avatarFilename"
              :src="contact.avatarFilename"
              alt="avatar"
              class="w-10 h-10 rounded-full object-cover border"
            />
            <div
              v-else
              class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold uppercase"
            >
              {{ contact.name.charAt(0) }}
            </div>

            <!-- Nombre y botones -->
            <div class="flex-1 flex flex-col gap-2">
              <p class="text-sm font-medium text-gray-800 truncate">
                {{ contact.name }}
              </p>
            </div>
          </div>
          <div class="flex flex-col flex-1 gap-2 w-full sm:w-fit">
            <button
              @click="deleteContact(contact.id)"
              class="flex justify-betweenbtn btn-red btn-xs p-2 gap-2 items-center"
              title="Delete contact"
            >
              REMOVE CONTACT<UserRoundMinus :size="20" />
            </button>
            <button
              @click="openChat(contact.name)"
              class="btn btn-success btn-xs p-2 flex gap-2 items-center justify-between"
              title="Open chat"
            >
              OPEN CHAT<MessageCircle :size="20" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
