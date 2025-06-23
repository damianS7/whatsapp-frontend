<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import MessageAlert from "@/components/MessageAlert.vue";
import { onMounted, ref } from "vue";
import ProfileEditableField from "./components/ProfileEditableField.vue";
import ProfilePhoto from "./components/ProfilePhotoUploader.vue";
import ConfirmPasswordModal from "@/components/modal/ConfirmPasswordModal.vue";
import ConfirmMessageModal from "@/components/modal/ConfirmMessageModal.vue";
import { GenderType } from "@/types/Profile";
import { MessageType } from "@/types/Message";

const customerStore = useCustomerStore();
const customer = customerStore.getLoggedCustomer;
const genderTypes: GenderType[] = ["MALE", "FEMALE"];
const genderOptions = genderTypes.map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));
// TODO add zod validation
// message to show
const alert = ref();

// modals to show
const modals = {
  requestCard: ref(),
  transfer: ref(),
  confirmPassword: ref(),
  confirmMessage: ref(),
};

// updatable fields to be displayed
const formFields = ref([
  {
    name: "firstName",
    type: "text",
    placeholder: "First name",
    value: customerStore.customer.profile?.firstName,
    error: "",
    isEditing: false,
    edited: false,
    // validation: zod
  },
  {
    name: "lastName",
    type: "text",
    placeholder: "Last name",
    value: customer.profile?.lastName,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "email",
    type: "email",
    placeholder: "Email",
    value: customer.email,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "phone",
    type: "text",
    placeholder: "Phone",
    value: customer.profile?.phone,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "gender",
    type: "select",
    placeholder: "Gender",
    value: customer.profile?.gender,
    options: genderOptions,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "birthdate",
    type: "date",
    placeholder: "Birthdate",
    value: customer.profile?.birthdate,
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
  const currentPassword = await modals.confirmPassword.value.open();

  // nothing to update
  if (field.value.length == 0 || currentPassword.length == 0) {
    return;
  }

  // request for update
  await customerStore
    .patchProfile(currentPassword, {
      [field.name]: field.value,
    })
    .then((profile) => {
      customerStore.setProfile(profile);
      formFields.value[index].value = field.value;
      alert.value.showMessage(
        "Field successfully updated.",
        MessageType.SUCCESS
      );
    })
    .catch((error) => {
      alert.value.showMessage(error.message, MessageType.ERROR);
    });
}

// change the password
async function updatePassword(index: number, newPassword: string) {
  // wait for the user to input his password
  const currentPassword = await modals.confirmPassword.value.open();

  // nothing to update
  if (currentPassword.length == 0 || newPassword.length == 0) {
    return;
  }

  // request for update
  await customerStore
    .changePassword(currentPassword, newPassword)
    .then(() => {
      alert.value.showMessage(
        "Password successfully updated.",
        MessageType.SUCCESS
      );
    })
    .catch((error) => {
      alert.value.showMessage(error.message, MessageType.ERROR);
    });
}

// update profile photo
async function updatePhoto(photo: any) {
  // wait for the user to input his password
  const password = await modals.confirmPassword.value.open();

  // if password is not set
  if (password.length == 0) {
    return;
  }

  await customerStore
    .uploadPhoto(password, photo)
    .then((blob) => {
      localStorage.setItem("profilePhotoURL", URL.createObjectURL(blob));
      customerStore.setPhoto(blob);
      alert.value.showMessage(
        "Photo successfully updated.",
        MessageType.SUCCESS
      );
    })
    .catch((error) => {
      alert.value.showMessage(error.message, MessageType.ERROR);
    });
}

// upade email field
async function updateEmail(index: number, newEmail: string) {
  await modals.confirmMessage.value.open(
    "Session will be closed after you change your email."
  );

  // wait for the user to input his password
  const currentPassword = await modals.confirmPassword.value.open();

  // nothing to update
  if (newEmail.length == 0 || currentPassword.length == 0) {
    return;
  }

  // request for update
  await customerStore
    .patchEmail(currentPassword, newEmail)
    .then((customer) => {
      customerStore.setEmail(customer.email);
      formFields.value[index].value = newEmail;
      alert.value.showMessage(
        "Field successfully updated.",
        MessageType.SUCCESS
      );
    })
    .catch((error) => {
      alert.value.showMessage(error.message, MessageType.ERROR);
    });
}

onMounted(() => {
  //
});
</script>
<template>
  <div class="main-container grid overflow-hidden h-full">
    <ConfirmPasswordModal :ref="modals.confirmPassword" />
    <ConfirmMessageModal :ref="modals.confirmMessage" />

    <section
      class="sm:flex gap-1 items-center text-2xl font-bold border-b border-gray-300 p-1"
    >
      <h1>Profile</h1>
    </section>

    <section class="container overflow-scroll h-full">
      <MessageAlert class="mb-4" ref="alert" />
      <div class="flex justify-center">
        <ProfilePhoto @update="updatePhoto" />
      </div>
      <div
        v-if="customerStore.customer.profile"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
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
