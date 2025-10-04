<script setup lang="ts">
import { ref } from "vue";
import { authService } from "@/services/authService";
import { z } from "zod";
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
import type { ApiResponse } from "@/types/response/ApiResponse";
import { useRoute } from "vue-router";
import CustomAlert from "@/components/CustomAlert.vue";

const route = useRoute();
const alert = ref<InstanceType<typeof CustomAlert>>();
const token = ref<string>(String(route.params.token) || "");

// form
const form = ref({
  password1: {
    type: "password",
    placeholder: "Password",
    value: "",
  },
  password2: {
    type: "password",
    placeholder: "Repeat password",
    value: "",
  },
});

// form errors
const formErrors = ref<Record<keyof typeof form.value, string[]>>({
  password1: [],
  password2: [],
});

const fieldSchema = z.object({
  value: z
    .string()
    .min(8, "Must contains at least 8 characters")
    .regex(/[A-Z]/, "Must contains at least one uppercase")
    .regex(/[a-z]/, "Must contains at least one lowercase")
    .regex(/[0-9]/, "Must contains at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contains at least one specialcharacter"),
});

const resolver = z.object({
  password1: fieldSchema,
  password2: fieldSchema,
});

async function onFormSubmit() {
  resetFormErrors();

  // field validation
  const result = resolver.safeParse(form.value);

  // if fails to validate fields
  if (!result.success) {
    const fieldErrors: any = result.error.flatten().fieldErrors;

    Object.keys(fieldErrors).forEach((key) =>
      formErrors.value[key as keyof typeof form.value].push(...fieldErrors[key])
    );

    return;
  }

  // // check if password does not match
  if (form.value.password1.value !== form.value.password2.value) {
    alert.value?.error("Password does not match.");
    return;
  }

  try {
    const response: ApiResponse = await authService.resetPasswordSet(
      form.value.password1.value,
      token.value
    );

    alert.value?.success(response.message, { timeout: 10 });
  } catch (error: any) {
    alert.value?.exception(error);
  }
}

function resetFormErrors() {
  Object.keys(formErrors.value).forEach(
    (key) => (formErrors.value[key as keyof typeof form.value] = [])
  );
}
</script>
<template>
  <form :resolver="resolver" @submit.prevent="onFormSubmit">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl"> Set password </CardTitle>
        <CardDescription> Set a new password. </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div v-for="(field, key) in form" :key="key" class="grid gap-2">
          <Label :for="key" class="capitalize">{{ field.placeholder }}</Label>
          <Input
            v-model="field.value"
            :name="key"
            :type="field.type"
            class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p
            v-if="formErrors[key]"
            v-for="(error, index) in formErrors[key]"
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
