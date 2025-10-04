<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
import { ref } from "vue";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

defineProps<{
  title: string;
}>();

const fields = ref({
  password: "",
  repeatPassword: "",
});

const modalStore = useModalStore();

function onSubmit() {
  if (fields.value.password !== fields.value.repeatPassword) {
    return;
  }
  modalStore.resolve(fields.value.password);
}
</script>
<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{{ title }}</DialogTitle>
    </DialogHeader>
    <form id="repeatPasswordForm" @submit.prevent="onSubmit" class="space-y-4">
      <div class="flex flex-col">
        <label for="password" class="text-gray-400 mb-1 text-sm font-medium"
          >Password</label
        >
        <input
          id="password"
          type="password"
          v-model="fields.password"
          placeholder="Password"
          required
          class="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div class="flex flex-col">
        <label
          for="repeatPassword"
          class="text-gray-400 mb-1 text-sm font-medium"
          >Repeat your password</label
        >
        <input
          id="repeatPassword"
          type="password"
          v-model="fields.repeatPassword"
          placeholder="Repeat your password"
          required
          class="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>
    </form>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="secondary">Cancel</Button>
      </DialogClose>
      <Button type="submit" form="repeatPasswordForm">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</template>
