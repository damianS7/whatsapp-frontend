<script setup lang="ts">
import { ref, defineEmits, Ref, computed, onMounted } from "vue";
import MessageAlert from "@/components/MessageAlert.vue";
import { MessageType } from "@/types/Message";
import { useGroupStore } from "@/stores/group";
import { useRoute, useRouter } from "vue-router";
import ConfirmMessageModal from "@/components/modal/ConfirmMessageModal.vue";
import GroupMemberForm from "@/views/groups/components/GroupMemberForm.vue";

const route = useRoute();
const router = useRouter();

// modals to show
const modals = {
  confirmMessage: ref(),
};

// store
const groupStore = useGroupStore();

// message to show
const alert = ref();

// data
const group = computed(() =>
  groupStore.getGroup(parseInt(route.params.id as string, 10))
);

// form interface
interface FormGroup {
  name: string;
  description: string;
}

const form: Ref<FormGroup> = ref({
  name: group.value?.name || "",
  description: group.value?.description || "",
});

async function saveGroup() {
  if (!group.value) {
    return;
  }

  await groupStore
    .updateGroup(group.value.id, form.value)
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
      <div class="flex items-center gap-1">
        <button @click="deleteGroup" class="btn btn-danger btn-sm">
          DELETE
        </button>
        <button @click="saveGroup" class="btn btn-primary btn-sm">SAVE</button>
      </div>
    </section>

    <section class="flex flex-col container gap-4 overflow-auto h-full">
      <MessageAlert ref="alert" />
      <div class="bg-gray-300 rounded p-4">
        <label for="groupName" class="font-semibold block text-sm text-gray-600"
          >Group name</label
        >
        <input
          id="groupName"
          v-model="form.name"
          type="text"
          placeholder="Music"
          class="bg-gray-200 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <div class="bg-gray-300 border border-gray-200 rounded-xl shadow-sm p-4">
        <label
          for="groupDescription"
          class="block text-sm text-gray-600 font-semibold mb-1"
          >Group description</label
        >
        <textarea
          id="groupDescription"
          v-model="form.description"
          placeholder="Short description for the group ..."
          class="bg-gray-200 w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        ></textarea>
      </div>

      <GroupMemberForm />
    </section>
  </div>
</template>
