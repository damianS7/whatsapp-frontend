<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { ref, defineEmits, Ref } from "vue";
import MessageAlert from "@/components/MessageAlert.vue";
import { MessageType } from "@/types/Message";
import { useGroupStore } from "@/stores/group";
import { useRouter } from "vue-router";
const router = useRouter();
// emit
const emit = defineEmits(["hidePanel"]);

// store
const groupStore = useGroupStore();

// message to show
const alert = ref();

// form interface
interface FormGroup {
  name: string;
  description: string;
}

const form: Ref<FormGroup> = ref({
  name: "",
  description: "",
});

// function to create a group
async function createGroup() {
  await groupStore
    .createGroup({
      name: form.value.name,
      description: form.value.description,
    })
    .then((group) => {
      router.push("/groups/" + group.id);
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
      <div class="flex gap-2 items-center">
        <button @click="createGroup" class="btn btn-primary btn-sm">
          CREATE
        </button>
        <button @click="emit('hidePanel')" class="btn btn-sm btn-blue">
          <ArrowLeft :size="20" />
        </button>
      </div>
    </section>
    <section class="flex flex-col container gap-4 overflow-auto h-full">
      <MessageAlert ref="alert" />
      <div class="bg-gray-300 rounded p-4">
        <label
          for="groupName"
          class="mb-2 font-semibold block text-sm text-gray-600"
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
          class="mb-2 block text-sm text-gray-600 font-semibold"
          >Group description</label
        >
        <textarea
          id="groupDescription"
          v-model="form.description"
          placeholder="Short description for the group ..."
          class="bg-gray-200 w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        ></textarea>
      </div>
    </section>
  </div>
</template>
