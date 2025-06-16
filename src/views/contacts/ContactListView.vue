<script setup lang="ts">
import { Contact } from "@/types/Contact";
import { useContactStore } from "@/stores/contact";
import { computed } from "vue";
import { useChatStore } from "@/stores/chat";
import { Chat } from "@/types/Chat";
import { MessageCircle } from "lucide-vue-next";
const chatStore = useChatStore();
const contactStore = useContactStore();
const contacts = computed(() => contactStore.getContacts as Contact[]);

function openConversation(name: string) {
  const existingChat = chatStore.getChat(name);
  if (existingChat) {
    // set as defaulttab
    return;
  }

  const chat = {
    name: name,
    type: "CONVERSATION",
    history: [
      {
        sender: "DAMIAN",
        message: "Hey!",
      },
      {
        sender: "RONALD",
        message: "Hello brother!",
      },
    ],
    participants: [{ name: "RONALD" }],
  } as Chat;
  chatStore.addChat(chat);
}

function deleteContact(id: number) {
  console.log(id);
}
</script>
<template>
  <div class="main-container shadow-none rounded-none">
    <section
      class="sm:flex gap-1 items-center text-2xl font-bold border-b border-gray-300 p-1 mb-4"
    >
      <h1>Contacts</h1>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="(contact, index) in contacts"
        :key="index"
        class="rounded bg-gray-300 p-4 flex items-center justify-between"
      >
        <img src="" alt="" class="w-8 h-8 rounded-full bg-white" />
        <span class="ml-2 flex-1">{{ contact.name }}</span>
        <button
          @click="openConversation(contact.name)"
          class="btn btn-sm btn-success"
        >
          <MessageCircle :size="20" />
        </button>
        <button @click="deleteContacts(contact.id)" class="btn btn-sm btn-red">
          -
        </button>
      </div>
    </section>
  </div>
</template>
