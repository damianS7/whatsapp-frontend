<!-- ModalManager.vue -->
<script setup lang="ts">
import { Dialog } from "@/components/ui/dialog";
import { useModalStore } from "@/stores/modal";
import ConfirmMessage from "@/components/modal/ConfirmMessageModal.vue";
import ConfirmPassword from "@/components/modal/ConfirmPasswordModal.vue";
import ConfirmNewPassword from "@/views/profile/components/ProfileNewPasswordConfirmModal.vue";
const modalStore = useModalStore();

const modals = {
  ConfirmMessage,
  ConfirmPassword,
  ConfirmNewPassword,
};

function handleUpdateOpen() {
  modalStore.resolve(false);
}
</script>
<template>
  <Dialog v-model:open="modalStore.visible" @update:open="handleUpdateOpen">
    <component
      :is="modals[modalStore.component as keyof typeof modals]"
      v-bind="modalStore.props"
    />
  </Dialog>
</template>
