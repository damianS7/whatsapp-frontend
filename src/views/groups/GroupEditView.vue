<script setup lang="ts">
import { ArrowLeft, X } from "lucide-vue-next";
import { ref, defineEmits, Ref, computed, onMounted } from "vue";
import MessageAlert from "@/components/MessageAlert.vue";
import { MessageType } from "@/types/Message";
import { useGroupStore } from "@/stores/group";
import { useContactStore } from "@/stores/contact";
import type { Contact } from "@/types/Contact";
import { number } from "zod";
import { useRoute, useRouter } from "vue-router";
import { Group } from "@/types/Group";
import ConfirmMessageModal from "@/components/modal/ConfirmMessageModal.vue";
import { GroupMember } from "@/types/GroupMember";

// modals to show
const modals = {
  confirmMessage: ref(),
};
const route = useRoute();
const router = useRouter();
const groupStore = useGroupStore();
const contactStore = useContactStore();
const group = computed(() =>
  groupStore.getGroup(parseInt(route.params.id as string, 10))
);
const contacts = computed(() => {
  return contactStore.getContacts.filter((contact) => {
    return contact.name
      .toLowerCase()
      .includes(memberNameFilter.value.toLowerCase());
  });
});
const membersToAdd = ref(group.value?.members) as Ref<GroupMember[]>;
// message to show
const alert = ref();

interface FormGroup {
  name: string;
  description: string;
  membersId: number[];
}

const memberNameFilter = ref("");
const formGroup: Ref<FormGroup> = ref({
  name: group.value?.name,
  description: group.value?.description,
  membersId: [],
});

function addMember(contact: Contact) {
  membersToAdd.value.push({
    id: 0,
    customerName: contact.name,
    customerId: contact.contactCustomerId,
    avatarFilename: contact.avatarFilename,
    groupId: group.value?.id || 0,
  });
  formGroup.value.membersId.push(contact.contactCustomerId);
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

function saveGroup() {
  groupStore
    .updateGroup(group.value.id, formGroup.value)
    .then((group) => {
      alert.value.showMessage(
        "Group " + group.name + " sucessfully updated.",
        MessageType.SUCCESS
      );
    })
    .catch((error) => {
      alert.value.showMessage(error.message, MessageType.ERROR);
    });
}
async function deleteGroup() {
  const confirm = await modals.confirmMessage.value.open(
    "Are you sure you want to delete this group?"
  );
  if (!confirm) {
    return;
  }
  const id = parseInt(route.params.id as string, 10);
  groupStore
    .deleteGroup(id)
    .then(() => {
      router.push("/groups");
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
      class="flex items-center justify-between text-2xl font-bold border-b border-gray-300 p-1 px-2"
    >
      <h1>Edit Group</h1>
    </section>
    <section class="flex flex-col container gap-4 overflow-auto h-full">
      <MessageAlert ref="alert" />
      <div class="bg-gray-300 rounded p-4">
        <label for="groupName" class="font-semibold block text-sm text-gray-600"
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
          class="block text-sm text-gray-600 font-semibold"
          >Group members</label
        >
        <div class="relative">
          <input
            id="groupMembers"
            v-model="memberNameFilter"
            type="text"
            placeholder="David, Maria ..."
            class="bg-gray-200 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
            {{ member.customerName }}
            <X class="cursor-pointer" @click="removeMember(member.id)" />
          </span>
        </div>
      </div>

      <div class="bg-gray-300 border border-gray-200 rounded-xl shadow-sm p-4">
        <label
          for="groupDescription"
          class="block text-sm text-gray-600 font-semibold mb-1"
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
          @click="saveGroup"
          class="w-full sm:w-auto px-6 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          SUBMIT
        </button>
      </div>
    </section>
  </div>
</template>
