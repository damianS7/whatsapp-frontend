<script setup lang="ts">
import CustomAlert from "@/components/CustomAlert.vue";
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
import { useAuthStore } from "@/stores/auth";
import { z } from "zod";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const alert = ref<InstanceType<typeof CustomAlert>>();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// form
const form = ref({
  email: "",
  password: "",
});

const formErrors = ref<Record<keyof typeof form.value, string[]>>({
  email: [],
  password: [],
});

const resolver = ref(
  z.object({
    email: z.string().nonempty({
      message: "Email cannot be empty.",
    }),
    password: z.string().nonempty({
      message: "Password cannot be empty.",
    }),
  })
);

function resetFormErrors() {
  Object.keys(formErrors.value).forEach(
    (key) => (formErrors.value[key as keyof typeof form.value] = [])
  );
}

function onFormSubmit() {
  resetFormErrors();
  const result = resolver.value.safeParse(form.value);

  // if fails to validate fields
  if (!result.success) {
    const fieldErrors: any = result.error.flatten().fieldErrors;

    Object.keys(fieldErrors).forEach((key) =>
      formErrors.value[key as keyof typeof form.value].push(...fieldErrors[key])
    );
    return;
  }

  authStore
    .login(form.value.email, form.value.password)
    .then(() => {
      const to = route.query.redirect?.toString() || "/";
      router.push(to);
    })
    .catch((error) => {
      alert.value?.exception(error);
    });
}
</script>
<template>
  <form :resolver="resolver" @submit.prevent="onFormSubmit">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl"> Login </CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            v-model="form.email"
            id="email"
            type="email"
            placeholder="mail@example.com"
            required
          />
          <p
            v-if="formErrors.email"
            v-for="(error, index) in formErrors.email"
            :key="index"
            class="text-sm text-red-500 ml-2"
          >
            {{ error }}
          </p>
        </div>
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input
            v-model="form.password"
            id="password"
            type="password"
            required
          />
          <p
            v-if="formErrors.password"
            v-for="(error, index) in formErrors.password"
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
