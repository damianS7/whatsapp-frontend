<script setup lang="ts">
import { X } from "lucide-vue-next";
import { ref, type Ref, computed } from "vue";
import { useGroupStore } from "@/stores/group";
import { useContactStore } from "@/stores/contact";
import type { Contact } from "@/types/Contact";
import { useRoute } from "vue-router";
import { useChat } from "@/composables/useChat";
import type { GroupMember } from "@/types/GroupMember";
const { isLoggedUser } = useChat();
const contactNameFilter = ref("");
const route = useRoute();

// store
const groupStore = useGroupStore();
const contactStore = useContactStore();

// data
const group = computed(() =>
  groupStore.getGroup(parseInt(route.params.id as string, 10))
);

const contacts = computed(() => {
  return contactStore.contacts.filter((contact) => {
    // check if the contact is already a member of the group
    return contact.name
      .toLowerCase()
      .includes(contactNameFilter.value.toLowerCase());
  });
});

// group members to show in the form
const groupMembers = computed(() => {
  return (
    group.value?.members.filter((member) => {
      // filter out the logged user (OWNER) from the group members
      return !isLoggedUser(member.userId);
    }) ?? []
  );
}) as Ref<GroupMember[]>;

// functions
// add members to the group
async function addMember(contact: Contact) {
  if (!group.value) {
    return;
  }

  await groupStore
    .addGroupMember(group.value.id, contact.userId)
    .then()
    .catch();

  contactNameFilter.value = "";
}

async function removeMember(userId: number) {
  if (!group.value) {
    return;
  }

  await groupStore.deleteGroupMember(group.value.id, userId);
}
</script>
<template>
  <div
    class="flex flex-col gap-2 bg-gray-300 border border-gray-200 rounded-xl shadow-sm p-4"
  >
    <label for="groupMembers" class="block text-sm text-gray-600 font-semibold"
      >Group members</label
    >
    <div class="relative">
      <input
        id="groupMembers"
        v-model="contactNameFilter"
        type="text"
        placeholder="David, Maria ..."
        class="bg-gray-200 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <ul
        v-if="contacts.length && contactNameFilter"
        class="absolute left-0 right-0 top-full w-full max-w-full border border-gray-300 rounded-md bg-white shadow z-10"
      >
        <li
          v-for="(contact, index) in contacts"
          :key="index"
          class="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
          @click="addMember(contact)"
        >
          {{ contact.name }}
        </li>
      </ul>
    </div>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="member in groupMembers"
        :key="member.userId"
        class="flex pill pill-primary items-center"
      >
        {{ member.userName }}
        <button @click="removeMember(member.userId)">
          <X class="cursor-pointer" />
        </button>
      </span>
    </div>
  </div>
</template>
