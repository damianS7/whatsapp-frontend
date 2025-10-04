<script setup lang="ts">
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
import { useRoute } from "vue-router";
import { ref } from "vue";
import { authService } from "@/services/authService";
import type { ApiResponse } from "@/types/response/ApiResponse";
import CustomAlert from "@/components/CustomAlert.vue";

const route = useRoute();
const alert = ref<InstanceType<typeof CustomAlert>>();
const token = ref<string>((route.params.token as string | undefined) ?? "");

// form
const form = ref({
  token: {
    type: "text",
    placeholder: "Insert your token",
    value: token,
  },
});

// form errors
const formErrors = ref<Record<keyof typeof form.value, string[]>>({
  token: [],
});

const fieldSchema = z.object({
  value: z.string().min(10, "Invalid token"),
});

const resolver = z.object({
  token: fieldSchema,
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

  try {
    const response: ApiResponse = await authService.activateAccount(
      form.value.token.value
    );
    alert.value?.success(response.message);
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
        <CardTitle class="text-2xl"> Account verification </CardTitle>
        <CardDescription>
          Your account will be verified if the token is valid.
          <p class="text-xs italic ml-2">
            I don't have a token.
            <RouterLink
              :to="{ name: 'resend-verification' }"
              class="hover:underline text-blue-600"
            >
              Resend Activation
            </RouterLink>
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div v-for="(field, key) in form" :key="key" class="grid gap-2">
          <Label :for="key" class="capitalize">{{ key }}</Label>
          <Input
            v-model="field.value"
            :name="key"
            :type="field.type"
            :placeholder="field.placeholder"
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
