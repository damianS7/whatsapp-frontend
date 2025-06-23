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
import { useCustomerStore } from "@/stores/customer";
import { useChat } from "@/composables/useChat";
import CustomerAvatar from "@/components/CustomerAvatar.vue";
const { generateChatId, getAvatarFilenameFromChat } = useChat();

// router
const router = useRouter();

// message to show
const alert = ref();

// modals to show
const modals = {
  confirmMessage: ref(),
};

// store
const chatStore = useChatStore();
const contactStore = useContactStore();
const customerStore = useCustomerStore();

// data
const contacts = computed(() => contactStore.getContacts as Contact[]);

// functions
// Open chat with the contact
function openChat(contact: Contact) {
  const chatId = generateChatId("PRIVATE", contact.contactCustomerId);
  const existingChat = chatStore.getChat(chatId);

  // if the chat not exists, create a new one
  if (!existingChat) {
    chatStore.addChat({
      id: chatId,
      name: contact.name,
      type: "PRIVATE",
      history: [],
      participants: [
        {
          customerId: contact.contactCustomerId,
          customerName: contact.name,
          customerAvatarFilename: contact.avatarFilename || "",
        },
        {
          customerId: customerStore.getLoggedCustomer.id,
          customerName: customerStore.getLoggedCustomer.profile.firstName,
          customerAvatarFilename:
            customerStore.getLoggedCustomer.profile.avatarFilename || "",
        },
      ],
    } as Chat);
  }

  // select the chat created or existing
  chatStore.selectChat(chatId);

  // redirect to the chat view
  router.push("/chats");
}

// Delete a contact
async function deleteContact(contact: Contact) {
  const confirm = await modals.confirmMessage.value.open(
    "Are you sure you want to delete this contact?"
  );

  // if the user cancels the confirmation, do nothing
  if (!confirm) {
    return;
  }
  // if the user confirms, delete the contact
  await contactStore
    .deleteContact(contact.id)
    .then(() => {
      alert.value.showMessage(
        "Deleted " + contact.name + " from contacts.",
        MessageType.SUCCESS
      );
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
            <div
              class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold uppercase"
            >
              <CustomerAvatar
                :filename="contact.avatarFilename ?? ''"
                :fallbackString="contact.name"
              />
            </div>

            <!-- Nombre y botones -->
            <div class="flex-1 flex flex-col gap-2">
              <p class="text-sm font-medium text-gray-800 truncate">
                {{ contact.name }}
              </p>
            </div>
          </div>
          <div class="flex flex-col flex-1 gap-2 w-full">
            <button
              @click="deleteContact(contact)"
              class="flex justify-between btn btn-red btn-xs p-2 gap-2 items-center"
              title="Delete contact"
            >
              REMOVE CONTACT<UserRoundMinus :size="20" />
            </button>
            <button
              @click="openChat(contact)"
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
