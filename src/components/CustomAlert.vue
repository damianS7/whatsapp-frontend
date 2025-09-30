<script setup lang="ts">
import Alert from "@/components/ui/alert/Alert.vue";
import AlertTitle from "@/components/ui/alert/AlertTitle.vue";
import AlertDescription from "@/components/ui/alert/AlertDescription.vue";
import { AlertType } from "@/types/AlertType";
import { X } from "lucide-vue-next";
import { ref, type Ref } from "vue";
// TODO fadeout
// TODO simplify and rename interfaces
// TODO exceptiosn
export interface CustomAlertType {
  message: string;
  type: AlertType;
  timeout: number;
  visible: boolean;
  closable: boolean;
  errors: Record<string, string[]>;
  title: string;
  // options: CustomAlertOptions
}

export interface CustomAlertOptions {
  errors?: Record<string, string[]>;
  title?: string;
  type?: AlertType;
  timeout?: number;
  closable?: boolean;
}

const alert = ref({
  message: "",
  errors: {},
  title: "",
  type: AlertType.INFO,
  timeout: 0,
  visible: false,
  closable: true,
}) as Ref<CustomAlertType>;

// props
function success(message: string, options?: CustomAlertOptions) {
  if (!options) {
    options = defaultOptions(AlertType.SUCCESS);
  }

  show(message, options);
}

function info(message: string, options?: CustomAlertOptions) {
  if (!options) {
    options = defaultOptions(AlertType.INFO);
  }

  show(message, options);
}

function error(message: string, options?: CustomAlertOptions) {
  if (!options) {
    options = defaultOptions(AlertType.ERROR);
  }

  show(message, options);
}

function exception(message: string, options?: CustomAlertOptions) {
  if (!options) {
    options = defaultOptions(AlertType.ERROR);
  }
  show(message, options);
}

// internal
function defaultOptions(type: AlertType): CustomAlertOptions {
  let options = {
    type,
  } as CustomAlertOptions;

  options.title ||= {
    [AlertType.INFO]: "Info",
    [AlertType.ERROR]: "Error",
    [AlertType.SUCCESS]: "Success",
  }[type];

  return options;
}

function show(message: string, options: CustomAlertOptions) {
  alert.value.type = options.type ?? alert.value.type;
  alert.value.timeout = options.timeout ?? alert.value.timeout;
  alert.value.closable = options.closable ?? alert.value.closable;
  alert.value.errors = options.errors ?? alert.value.errors;
  alert.value.message = message;
  alert.value.visible = true;

  if (alert.value.timeout && alert.value.timeout > 1) {
    setTimeout(() => {
      hide();
    }, alert.value.timeout * 1000);
  }
}

function hide() {
  alert.value.visible = false;
  // alert.value.message = "";

  // setTimeout(() => {
  //   alert.value.visible = false;
  // }, 1 * 1000);
}

defineExpose({ error, info, success, exception });
</script>
<template>
  <Alert
    v-if="alert.visible && alert.message"
    v-bind="$attrs"
    class="transition-opacity duration-500"
    :class="[
      alert.type === AlertType.INFO &&
        'bg-blue-100 border-blue-400 text-blue-700',
      alert.type === AlertType.ERROR &&
        'bg-red-100 border-red-400 text-red-700',
      alert.type === AlertType.SUCCESS &&
        'bg-green-100 border-green-400 text-green-700',
      alert.visible ? 'opacity-100' : 'opacity-0',
    ]"
  >
    <AlertTitle>
      <div class="flex items-center justify-between w-full">
        <span>{{ alert.title }}</span>
        <button type="button" class="cursor-pointer" @click="hide()">
          <X class="h-4 w-4" />
        </button>
      </div>
    </AlertTitle>
    <AlertDescription>
      {{ alert.message }}
      <ul v-if="alert.errors" class="list-disc ml-8">
        <li v-for="(errors, field) in alert.errors" :key="field">
          <b>{{ field }}</b>
          <p v-for="(error, field) in errors" :key="field">{{ error }}</p>
        </li>
      </ul>
    </AlertDescription>
  </Alert>
</template>
