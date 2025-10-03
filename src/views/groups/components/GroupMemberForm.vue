<script setup lang="ts">
import { X } from "lucide-vue-next";
import { ref, type Ref, computed } from "vue";
import { useGroupStore } from "@/stores/group";
import { useContactStore } from "@/stores/contact";
import type { Contact } from "@/types/Contact";
import { useRoute } from "vue-router";
import { useChat } from "@/composables/useChat";
import type { GroupMember } from "@/types/GroupMember";
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/components/ui/tags-input";

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

const contactsNotMembers = computed(() => {
  return contacts.value.filter(
    (contact) =>
      !groupMembers.value.some((member) => member.userId === contact.userId)
  );
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

const open = ref(false);
</script>
<template>
  <div
    class="flex flex-col gap-2 bg-gray-300 border border-gray-200 rounded-xl shadow-sm p-4"
  >
    <label for="groupMembers" class="block text-sm text-gray-600 font-semibold"
      >Group members</label
    >
    <Combobox v-model="contacts" v-model:open="open" :ignore-filter="false">
      <ComboboxAnchor as-child>
        <TagsInput v-model="groupMembers" class="bg-gray-200">
          <TagsInputItem
            v-for="(member, index) in groupMembers"
            :key="index"
            :value="member.userName"
            class="bg-blue-200 text-blue-500 font-bold text-sm"
          >
            <TagsInputItemText />
            <TagsInputItemDelete @click="removeMember(member.userId)" />
          </TagsInputItem>

          <ComboboxInput v-model="contactNameFilter" as-child>
            <TagsInputInput
              placeholder="Contacts ..."
              class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
              @keydown.enter.prevent
            />
          </ComboboxInput>
        </TagsInput>

        <ComboboxList class="w-[--reka-popper-anchor-width]">
          <ComboboxEmpty />
          <ComboboxGroup>
            <ComboboxItem
              v-for="contact in contactsNotMembers"
              :key="contact.userId"
              :value="contact.name"
              @select.prevent="
                (ev) => {
                  if (typeof ev.detail.value === 'string') {
                    contactNameFilter = '';
                    // modelValue.push(ev.detail.value);
                    addMember(contact);
                  }

                  if (groupMembers.length === 0) {
                    open = false;
                  }
                }
              "
            >
              {{ contact.name }}
            </ComboboxItem>
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxAnchor>
    </Combobox>
  </div>
</template>
