<script setup lang="ts">
import { useModalStore } from "@/stores/modal";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
defineProps<{
  title: string;
  message: string;
}>();

const modalStore = useModalStore();

function onSubmit() {
  modalStore.resolve(true);
}
</script>
<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{{ title }}</DialogTitle>
      <DialogDescription>
        {{ message }}
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <form @submit.prevent="onSubmit" class="flex gap-2">
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <Button type="submit">Confirm</Button>
      </form>
    </DialogFooter>
  </DialogContent>
</template>
