<script setup lang="ts">
import Alert from "@/components/ui/alert/Alert.vue";
import AlertTitle from "@/components/ui/alert/AlertTitle.vue";
import AlertDescription from "@/components/ui/alert/AlertDescription.vue";
import { AlertType } from "@/types/AlertType";
import { X } from "lucide-vue-next";
import { ref } from "vue";
import { ApiResponse } from "@/types/response/ApiResponse";

export interface AlertOptions {
  type?: AlertType;
  title?: string;
  timeout?: number;
  closable?: boolean;
}

const alert = ref({
  type: AlertType.INFO,
  title: "",
  message: "",
  timeout: 0,
  closable: true,
  errors: {},
  visible: false,
  fading: false,
});

// props
function success(message: string, options?: AlertOptions) {
  options = validateOptions(AlertType.SUCCESS, options);

  show(message, options);
}

function info(message: string, options?: AlertOptions) {
  options = validateOptions(AlertType.INFO, options);

  show(message, options);
}

function error(message: string, options?: AlertOptions) {
  options = validateOptions(AlertType.ERROR, options);

  show(message, options);
}

function exception(exception: any, options?: AlertOptions) {
  options = validateOptions(AlertType.ERROR, options);

  if (exception instanceof ApiResponse) {
    show(exception.message, options);
    alert.value.errors = exception.errors ?? {};
    return;
  }

  if (exception && exception.message) {
    show(exception.message || "", options);
    return;
  }

  show("Unkown error exception", options);
}

// internal
function validateOptions(
  type: AlertType,
  options?: AlertOptions
): AlertOptions {
  if (!options) {
    options = {} as AlertOptions;
  }

  options.closable = options.closable ?? true;
  options.type = options.type ?? type;
  options.timeout = options.timeout ?? 0;
  options.title =
    options.title ??
    {
      [AlertType.INFO]: "Info",
      [AlertType.ERROR]: "Error",
      [AlertType.SUCCESS]: "Success",
    }[type];

  return options;
}

function show(message: string, options: AlertOptions) {
  alert.value.message = message;
  alert.value.title = options.title ?? alert.value.title;
  alert.value.type = options.type ?? alert.value.type;
  alert.value.timeout = options.timeout ?? alert.value.timeout;
  alert.value.closable = options.closable ?? alert.value.closable;
  alert.value.visible = true;

  if (alert.value.timeout && alert.value.timeout > 1) {
    setTimeout(() => {
      hide();
    }, alert.value.timeout * 1000);
  }
}

function hide() {
  alert.value.fading = true;

  setTimeout(() => {
    alert.value.visible = false;
    alert.value.fading = false;
  }, 500);
}

defineExpose({ error, info, success, exception });
</script>
<template>
  <Alert
    v-if="alert.visible"
    v-bind="$attrs"
    class="transition-opacity duration-500"
    :class="[
      alert.type === AlertType.INFO &&
        'bg-blue-100 border-blue-400 text-blue-700',
      alert.type === AlertType.ERROR &&
        'bg-red-100 border-red-400 text-red-700',
      alert.type === AlertType.SUCCESS &&
        'bg-green-100 border-green-400 text-green-700',
      alert.fading ? 'opacity-0' : 'opacity-100',
    ]"
  >
    <AlertTitle>
      <div class="flex items-center justify-between w-full">
        <span>{{ alert.title }}</span>
        <button
          v-if="alert.closable"
          type="button"
          class="cursor-pointer"
          @click="hide()"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </AlertTitle>
    <AlertDescription>
      {{ alert.message }}
      <ul v-if="alert.errors" class="list-disc ml-8">
        <li v-for="(error, field) in alert.errors" :key="field">
          <b>{{ field }}</b>
          <p>{{ error }}</p>
        </li>
      </ul>
    </AlertDescription>
  </Alert>
</template>
