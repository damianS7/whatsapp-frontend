<script setup lang="ts">
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
import { ref } from "vue";
import { z } from "zod";
import type { GenderType } from "@/types/User";
import type { UserRegisterRequest } from "@/types/UserRegisterRequest";
import { useAuthStore } from "@/stores/auth";

// store
const authStore = useAuthStore();

// gender types/options
const genderTypes: GenderType[] = ["MALE", "FEMALE"];
const genderOptions = genderTypes.map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));

// form fields
const form = ref({
  email: {
    type: "email",
    placeholder: "Email",
    value: "",
  },
  password: {
    type: "password",
    placeholder: "Password",
    value: "",
  },
  username: {
    type: "text",
    placeholder: "Your @username",
    value: "",
  },
  firstname: {
    type: "text",
    placeholder: "First name",
    value: "",
  },
  lastname: {
    type: "text",
    placeholder: "Last name",
    value: "",
  },
  phone: {
    type: "text",
    placeholder: "Phone",
    value: "",
  },
  gender: {
    type: "select",
    placeholder: "Gender",
    value: "",
    options: genderOptions,
  },
  birthdate: {
    type: "date",
    placeholder: "Birthdate",
    value: "",
  },
});

// form errors
const formErrors = ref<Record<keyof typeof form.value, string[]>>({
  email: [],
  password: [],
  username: [],
  firstname: [],
  lastname: [],
  phone: [],
  gender: [],
  birthdate: [],
});

// form error on submit
const onSubmitError = ref();

const resolver = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  username: z.string().min(1, "Username is required"),
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  // TODO fix this. use genderOptions
  gender: z.enum(["MALE", "FEMALE"], {
    errorMap: () => ({ message: "Invalid gender" }),
  }),
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

const onFormSubmit = async () => {
  resetFormErrors();
  const formData = getFormData();
  const result = resolver.safeParse(formData);

  // if fails to validate fields
  if (!result.success) {
    const fieldErrors: any = result.error.flatten().fieldErrors;

    Object.keys(fieldErrors).forEach((key) =>
      formErrors.value[key as keyof typeof form.value].push(...fieldErrors[key])
    );

    return;
  }

  const userRegisterRequest: UserRegisterRequest = {
    email: formData.email,
    password: formData.password,
    userName: formData.username,
    firstName: formData.firstname,
    lastName: formData.lastname,
    phone: formData.phone,
    birthdate: formData.birthdate,
    gender: formData.gender as GenderType,
  };

  await authStore
    .register(userRegisterRequest)
    .then(() => {
      // TODO alert success
      onSubmitError.value = "Account created.";
    })
    .catch((error) => {
      // TODO alert error
      onSubmitError.value = error.message;
    });
};
</script>
<template>
  <form :resolver="resolver" @submit.prevent="onFormSubmit">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl"> Register </CardTitle>
        <CardDescription> Fill every field to register </CardDescription>
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
          <select
            v-if="field.type === 'select'"
            v-model="field.value"
            :name="fieldKey"
            class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
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
        <Button class="w-full" type="submit"> Sign up </Button>
        <p v-if="onSubmitError" class="text-sm text-red-500">
          {{ onSubmitError }}
        </p>
      </CardFooter>
    </Card>
  </form>
</template>
