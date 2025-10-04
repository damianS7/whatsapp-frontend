<script setup lang="ts">
import { ref } from "vue";
import { authService } from "@/services/authService";
import type { ApiResponse } from "@/types/response/ApiResponse";
import Button from "@/components/ui/button/Button.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import CustomAlert from "@/components/CustomAlert.vue";

const alert = ref<InstanceType<typeof CustomAlert>>();

// form fields
const form = ref({
  email: {
    type: "email",
    placeholder: "Insert your email.",
    value: "",
  },
});

// form errors
const formErrors = ref<Record<keyof typeof form.value, string[]>>({
  email: [],
});

const resolver = z.object({
  email: z.string().email("Email is required"),
});

// Convert form fields to key, value array
function getFormData() {
  return Object.fromEntries(
    Object.entries(form.value).map(([key, field]) => [key, field.value])
  );
}

function resetFormErrors() {
  Object.keys(formErrors.value).forEach(
    (key) => (formErrors.value[key as keyof typeof form.value] = [])
  );
}

async function onFormSubmit() {
  resetFormErrors();
  const result = resolver.safeParse(getFormData());

  // if fails to validate fields
  if (!result.success) {
    const fieldErrors: any = result.error.flatten().fieldErrors;

    Object.keys(fieldErrors).forEach((key) =>
      formErrors.value[key as keyof typeof form.value].push(...fieldErrors[key])
    );

    return;
  }

  try {
    const response: ApiResponse = await authService.resetPasswordRequest(
      form.value.email.value
    );

    alert.value?.info(response.message, { timeout: 10 });
  } catch (error: any) {
    alert.value?.exception(error);
  }
}
</script>
<template>
  <form :resolver="resolver" @submit.prevent="onFormSubmit">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl"> Password reset </CardTitle>
        <CardDescription>
          You will receive an email with instructions.
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div
          v-for="(field, fieldKey) in form"
          :key="fieldKey"
          class="grid gap-2"
        >
          <Label :for="fieldKey" class="capitalize">{{ fieldKey }}</Label>
          <Input
            v-if="field.type !== 'select'"
            v-model="field.value"
            :name="fieldKey"
            :type="field.type"
            :placeholder="field.placeholder"
            class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p
            v-if="formErrors[fieldKey]"
            v-for="(error, index) in formErrors[fieldKey]"
            :key="index"
            class="text-sm text-red-500 ml-2"
          >
            {{ error }}
          </p>
        </div>
      </CardContent>
      <CardFooter class="flex flex-col gap-2">
        <Button class="w-full" type="submit"> Submit </Button>
        <CustomAlert ref="alert" />
      </CardFooter>
    </Card>
  </form>
</template>
