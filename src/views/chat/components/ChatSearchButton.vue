<script setup lang="ts">
import { MessageSquarePlus } from "lucide-vue-next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Toggle from "@/components/ui/toggle/Toggle.vue";
import ChatContactGroupList from "@/views/chat/components/ChatSearchPopover.vue";
import { ref } from "vue";

const chatSearchPopoverToggle = ref(false);
</script>
<template>
  <Popover v-model:open="chatSearchPopoverToggle">
    <PopoverTrigger>
      <Toggle
        :model-value="chatSearchPopoverToggle"
        variant="default"
        size="sm"
        class="hover:bg-blue-200 cursor-pointer"
      >
        <MessageSquarePlus :size="20" />
      </Toggle>
    </PopoverTrigger>
    <PopoverContent side="bottom" align="center" class="bg-gray-200">
      <ChatContactGroupList @closePopover="chatSearchPopoverToggle = false" />
    </PopoverContent>
  </Popover>
</template>
