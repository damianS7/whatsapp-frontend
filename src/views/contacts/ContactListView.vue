<script setup lang="ts">
import type { Contact } from "@/types/Contact";
import { useContactStore } from "@/stores/contact";
import { ref, computed } from "vue";
import { useChatStore } from "@/stores/chat";
import { MessageCircle, UserRoundMinus } from "lucide-vue-next";
import { useRouter } from "vue-router";
import CustomAlert from "@/components/CustomAlert.vue";
import { useChat } from "@/composables/useChat";
import CustomAvatar from "@/components/CustomAvatar.vue";
import { useModalStore } from "@/stores/modal";
const { createPrivateChat } = useChat();

// router
const router = useRouter();

// message to show
const alert = ref<InstanceType<typeof CustomAlert>>();

// store
const modalStore = useModalStore();
const chatStore = useChatStore();
const contactStore = useContactStore();

// data
const contacts = computed(() => contactStore.contacts as Contact[]);

// functions
// Open chat with the contact
function openChat(contact: Contact) {
  const chat = createPrivateChat(contact);
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

// Delete a contact
async function deleteContact(contact: Contact) {
  const confirmed = await modalStore.open("ConfirmMessage", {
    title: "Delete contact",
    message: "Are you sure you want to delete this contact?",
  });

  // if the user cancels the confirmation, do nothing
  if (!confirmed) {
    return;
  }
  // if the user confirms, delete the contact
  await contactStore
    .deleteContact(contact.id)
    .then(() => {
      alert.value?.success("Deleted " + contact.name + " from contacts.");
    })
    .catch((error) => {
      alert.value?.exception(error);
    });
}
</script>
<template>
  <div
    class="main-container grid grid-rows-[auto_1fr] shadow-none rounded-none overflow-hidden h-full"
  >
    <section
      class="sm:flex items-center justify-between text-2xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Contacts</h1>
    </section>

    <section class="container overflow-auto h-full">
      <CustomAlert class="mb-2" ref="alert" />
      <div
        class="grid grid-cols-1 sm:grid-cols-3 grid-rows-[min-content_max-content] gap-2"
      >
        <div
          v-for="(contact, index) in contacts"
          :key="index"
          class="p-4 bg-gray-300 rounded"
        >
          <div class="flex gap-1">
            <!-- Avatar -->
            <CustomAvatar
              class="h-12 w-12 text-white font-bold text-xl uppercase"
              :src="contact.avatarUrl ?? ''"
              :fallback="contact.name"
            />

            <!-- name and buttons -->
            <div class="flex-1 flex flex-col gap-1 text-center">
              <p class="text-sm font-medium text-gray-800 truncate">
                {{ contact.name }}
              </p>

              <div class="flex gap-1 justify-center">
                <button
                  @click="openChat(contact)"
                  class="btn btn-info btn-sm flex gap-2 items-center justify-between"
                  title="Open chat"
                >
                  <MessageCircle :size="16" />
                </button>
                <button
                  @click="deleteContact(contact)"
                  class="btn btn-danger btn-sm flex gap-2 items-center justify-between"
                  title="Delete contact"
                >
                  <UserRoundMinus :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<style scoped>
@reference "tailwindcss";
.avatar {
  @apply h-12 w-12;
}
</style>
