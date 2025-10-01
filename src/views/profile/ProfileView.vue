<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import CustomAlert from "@/components/CustomAlert.vue";
import { onMounted, ref } from "vue";
import ProfileEditableField from "./components/ProfileEditableField.vue";
import ProfilePhoto from "./components/ProfilePhotoUploader.vue";
import type { GenderType } from "@/types/User";
import { useModalStore } from "@/stores/modal";
import ConfirmMessageModal from "@/components/modal/ConfirmMessageModal.vue";

// store
const modalStore = useModalStore();
const userStore = useUserStore();
const user = userStore.getLoggedUser;
const genderTypes: GenderType[] = ["MALE", "FEMALE"];
const genderOptions = genderTypes.map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));

// TODO add zod validation
// message to show
const alert = ref();

// updatable fields to be displayed
const formFields = ref([
  {
    name: "firstName",
    type: "text",
    placeholder: "First name",
    value: userStore.user.firstName,
    error: "",
    isEditing: false,
    edited: false,
    // validation: zod
  },
  {
    name: "lastName",
    type: "text",
    placeholder: "Last name",
    value: user.lastName,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "email",
    type: "email",
    placeholder: "Email",
    value: user.email,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "phone",
    type: "text",
    placeholder: "Phone",
    value: user.phone,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "gender",
    type: "select",
    placeholder: "Gender",
    value: user.gender,
    options: genderOptions,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "birthdate",
    type: "date",
    placeholder: "Birthdate",
    value: user.birthdate,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "password",
    type: "password",
    placeholder: "New password",
    value: "*********",
    error: "",
    isEditing: false,
    edited: false,
  },
]);

// update a single field
async function updateField(
  index: number,
  field: { name: string; value: string }
) {
  // updating email requires a different method
  if (field.name == "email") {
    updateEmail(index, field.value);
    return;
  }

  // updating password requires a different method
  if (field.name == "password") {
    updatePassword(index, field.value);
    return;
  }

  // wait for the user to input his password
  // const currentPassword = await modals.confirmPassword.value.open();
  const currentPassword = (await modalStore.open("ConfirmPassword", {
    title: "Confirm Password",
  })) as string;

  // nothing to update
  if (field.value.length == 0 || !currentPassword) {
    return;
  }

  // request for update
  await userStore
    .patchProfile(currentPassword, {
      [field.name]: field.value,
    })
    .then((profile) => {
      userStore.setProfile(profile);
      formFields.value[index].value = field.value;
      alert.value.success("Field successfully updated.");
    })
    .catch((error) => {
      alert.value.exception(error);
    });
}

// change the password
async function updatePassword(index: number, newPassword: string) {
  // wait for the user to input his password
  const currentPassword = (await modalStore.open("ConfirmPassword", {
    title: "Confirm Password",
  })) as string;

  // nothing to update
  if (currentPassword.length == 0 || newPassword.length == 0) {
    return;
  }

  // request for update
  await userStore
    .changePassword(currentPassword, newPassword)
    .then(() => {
      alert.value.success("Password successfully updated.");
    })
    .catch((error) => {
      alert.value.exception(error);
    });
}

// update profile photo
async function updatePhoto(photo: any) {
  // wait for the user to input his password
  const password = (await modalStore.open("ConfirmPassword", {
    title: "Confirm Password",
  })) as string;

  // if password is not set
  if (password.length == 0) {
    return;
  }

  await userStore
    .uploadPhoto(password, photo)
    .then((blob) => {
      localStorage.setItem("profilePhotoURL", URL.createObjectURL(blob));
      userStore.setPhoto(blob);
      alert.value.sucess("Photo successfully updated.");
    })
    .catch((error) => {
      alert.value.exception(error);
    });
}

// upade email field
async function updateEmail(index: number, newEmail: string) {
  const confirmed = await modalStore.open("ConfirmMessage", {
    title: "Confirm Email Change",
    message: "Session will be closed after you change your email.",
  });

  if (!confirmed) return;

  // wait for the user to input his password
  const currentPassword = (await modalStore.open("ConfirmPassword", {
    title: "Confirm Password",
  })) as string;

  // nothing to update
  if (newEmail.length == 0 || currentPassword.length == 0) {
    return;
  }

  // request for update
  await userStore
    .patchEmail(currentPassword, newEmail)
    .then((user) => {
      userStore.setEmail(user.email);
      formFields.value[index].value = newEmail;
      alert.value.success("Field successfully updated.");
    })
    .catch((error) => {
      alert.value.exception(error);
    });
}
</script>
<template>
  <div class="main-container grid overflow-hidden h-full">
    <section
      class="sm:flex gap-1 items-center text-2xl font-bold border-b border-gray-300 p-1"
    >
      <h1>Profile</h1>
    </section>

    <section class="container overflow-scroll h-full">
      <CustomAlert class="mb-4" ref="alert" />
      <div class="flex justify-center">
        <ProfilePhoto @update="updatePhoto" />
      </div>
      <div v-if="userStore.user" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileEditableField
          v-for="(field, index) in formFields"
          :key="index"
          :index="index"
          :field="field"
          @update="updateField"
        />
      </div>
    </section>
  </div>
</template>
