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
const messageAlert = ref({
  message: "",
  type: MessageType.ERROR,
  timeout: 12,
  visible: false,
});

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
    name: "country",
    type: "text",
    placeholder: "Country",
    value: customer.profile?.country,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "address",
    type: "text",
    placeholder: "Address",
    value: customer.profile?.address,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "postalCode",
    type: "text",
    placeholder: "Postal Code",
    value: customer.profile?.postalCode,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "nationalId",
    type: "text",
    placeholder: "National ID",
    value: customer.profile?.nationalId,
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
      showMessage("Field successfully updated.", MessageType.SUCCESS);
    })
    .catch((error) => {
      messageAlert.value.message = error.message || "Error updating field.";
      messageAlert.value.type = MessageType.ERROR;
      showMessage(error.data.message, MessageType.ERROR);
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
      showMessage("Password successfully updated.", MessageType.SUCCESS);
    })
    .catch((error) => {
      messageAlert.value.message = error.message || "Error updating password.";
      messageAlert.value.type = MessageType.ERROR;
      showMessage(error.data.message, MessageType.ERROR);
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
      showMessage("Photo successfully updated.", MessageType.SUCCESS);
    })
    .catch((error) => {
      messageAlert.value.message = error.message || "Error uplading image.";
      messageAlert.value.type = MessageType.ERROR;
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
      showMessage("Field successfully updated.", MessageType.SUCCESS);
    })
    .catch((error) => {
      messageAlert.value.message = error.message || "Error updating email.";
      messageAlert.value.type = MessageType.ERROR;
      showMessage(error.data.message, MessageType.ERROR);
    });
}

// it shows a message
function showMessage(message: string, type: MessageType, timeout?: number) {
  messageAlert.value.message = message;
  messageAlert.value.type = type;
  messageAlert.value.timeout = timeout ?? messageAlert.value.timeout;
  messageAlert.value.visible = true;
}
onMounted(() => {
  //
});
</script>
<template>
  <div>
    <ConfirmPasswordModal :ref="modals.confirmPassword" />
    <ConfirmMessageModal :ref="modals.confirmMessage" />
    <MessageAlert
      v-if="messageAlert.visible"
      class="mb-4"
      :message="messageAlert.message"
      :timeout="messageAlert.timeout"
      :type="messageAlert.type"
      @close="messageAlert.visible = false"
    />

    <div class="main-container">
      <section
        class="sm:flex gap-1 items-center text-2xl font-bold border-b border-gray-300 p-1 mb-1"
      >
        <h1>Profile</h1>
        <div class="flex flex-wrap gap-1 text-sm"></div>
      </section>

      <section>
        <ProfilePhoto @update="updatePhoto" />
        <div
          v-if="customerStore.customer.profile"
          class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4"
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
  </div>
</template>
