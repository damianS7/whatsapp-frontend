<script setup lang="ts">
import { ArrowLeft, X } from "lucide-vue-next";
import { ref, defineEmits, Ref, computed } from "vue";
import MessageAlert from "@/components/MessageAlert.vue";
import { MessageType } from "@/types/Message";
import { useGroupStore } from "@/stores/group";
import { useContactStore } from "@/stores/contact";
import type { Contact } from "@/types/Contact";
import { number } from "zod";
const emit = defineEmits(["hidePanel"]);
const groupStore = useGroupStore();
const contactStore = useContactStore();
const contacts = computed(() => {
  return contactStore.getContacts.filter((contact) => {
    return contact.name
      .toLowerCase()
      .includes(memberNameFilter.value.toLowerCase());
  });
});
const membersToAdd = ref([]) as Ref<Contact[]>;
// message to show
const alert = ref();

interface FormGroup {
  name: string;
  description: string;
  membersId: number[];
}

const memberNameFilter = ref("");
const formGroup: Ref<FormGroup> = ref({
  name: "",
  description: "",
  membersId: [],
});

function addMember(contact: Contact) {
  membersToAdd.value.push(contact);
  formGroup.value.membersId.push(contact.id);
  memberNameFilter.value = "";
}

function removeMember(id: number) {
  const index = membersToAdd.value.findIndex((contact) => {
    contact.id === id;
  });
  membersToAdd.value.splice(index, 1);

  const indexF = formGroup.value.membersId.findIndex((contactId) => {
    contactId === id;
  });
  formGroup.value.membersId.splice(indexF, 1);
}

function createGroup() {
  groupStore
    .createGroup(formGroup.value)
    .then((group) => {
      alert.value.showMessage(
        "Group " + group.name + " sucessfully created.",
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
    class="grid grid-rows-[auto_1fr] bg-gray-200 absolute overflow-hidden w-full h-full -left-0 min-h-full top-0 transition-all duration-500 transform z-10"
  >
    <section
      class="flex items-center justify-between text-2xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Create Group</h1>
      <button @click="emit('hidePanel')" class="btn btn-sm btn-blue">
        <ArrowLeft />
      </button>
    </section>
    <section class="flex flex-col container gap-4 overflow-auto h-full">
      <MessageAlert ref="alert" />
      <div class="bg-gray-300 rounded p-4">
        <label
          for="groupName"
          class="block text-sm text-gray-600 font-medium mb-1"
          >Group name</label
        >
        <input
          id="groupName"
          v-model="formGroup.name"
          type="text"
          placeholder="Music"
          class="bg-gray-200 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div
        class="flex flex-col gap-2 bg-gray-300 border border-gray-200 rounded-xl shadow-sm p-4"
      >
        <label
          for="groupMembers"
          class="block text-sm text-gray-600 font-medium mb-1"
          >Group members</label
        >
        <div class="relative">
          <input
            id="groupMembers"
            v-model="memberNameFilter"
            type="text"
            placeholder="David, Maria ..."
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <!-- Sugerencias -->
          <ul
            v-if="contacts.length && memberNameFilter"
            class="absolute left-0 right-0 top-full w-full max-w-full border border-gray-300 rounded-md bg-white shadow z-10"
          >
            <li
              v-for="contact in contacts"
              :key="contact.id"
              class="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
              @click="addMember(contact)"
            >
              {{ contact.name }}
            </li>
          </ul>
        </div>

        <!-- Lista de miembros seleccionados -->
        <div class="flex flex-wrap gap-2">
          <span
            v-for="member in membersToAdd"
            :key="member.id"
            class="flex pill pill-primary items-center"
          >
            {{ member.name }}
            <X class="cursor-pointer" @click="removeMember(member.id)" />
          </span>
        </div>
      </div>

      <div class="bg-gray-300 border border-gray-200 rounded-xl shadow-sm p-4">
        <label
          for="groupDescription"
          class="block text-sm text-gray-600 font-medium mb-1"
          >Group description</label
        >
        <textarea
          id="groupDescription"
          v-model="formGroup.description"
          placeholder="Short description for the group ..."
          class="bg-gray-200 w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        ></textarea>
      </div>

      <div class="text-right">
        <button
          @click="createGroup"
          class="w-full sm:w-auto px-6 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          SUBMIT
        </button>
      </div>
    </section>
  </div>
</template>
