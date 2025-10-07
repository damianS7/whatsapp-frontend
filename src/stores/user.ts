import { defineStore } from "pinia";
import type { User } from "@/types/User";
import { computed, ref } from "vue";
import { userService } from "@/services/userService";

export const useUserStore = defineStore("user", () => {
  const user = ref({} as User);
  const initialized = ref(false);

  const getLoggedUser = computed(() => {
    return user.value;
  });

  const getFullName = computed(() => {
    return user.value.firstName + " " + user.value.lastName;
  });

  async function fetchUser(): Promise<User> {
    const user: User = await userService.fetchUser();
    // TODO use then
    try {
      const resource = await userService.fetchProfileImage(user.id);
      user.avatarUrl = URL.createObjectURL(resource);
    } catch (error) {
      // contact.avatarUrl = "/default-avatar.jpg";
    }
    return user;
  }

  async function updateUser(
    currentPassword: string,
    fieldsToUpdate: Record<string, any>
  ): Promise<User> {
    const updatedUser: User = await userService.updateUser(
      currentPassword,
      fieldsToUpdate
    );

    // set the current avatar for the updated user
    updatedUser.avatarUrl = user.value.avatarUrl;
    user.value = updatedUser;
    return updatedUser;
  }

  async function updateEmail(
    currentPassword: string,
    newEmail: string
  ): Promise<User> {
    const updatedUser = await userService.updateEmail(
      currentPassword,
      newEmail
    );
    user.value.email = updatedUser.email;
    return updatedUser;
  }

  async function updatePassword(currentPassword: string, newPassword: string) {
    await userService.updatePassword(currentPassword, newPassword);
  }

  async function getPhoto(userId?: number): Promise<Blob> {
    if (!userId) {
      userId = user.value.id;
    }

    return await userService.fetchProfileImage(userId);
  }

  async function uploadPhoto(
    currentPassword: string,
    file: any
  ): Promise<Blob> {
    const blob = await userService.uploadProfileImage(currentPassword, file);
    user.value.avatarUrl = URL.createObjectURL(blob);
    return blob;
  }

  async function initialize() {
    await fetchUser().then((fuser) => {
      user.value = fuser;
    });
    // TODO remove this?
    if (!user.value.avatarUrl) {
      return;
    }

    initialized.value = true;
  }

  return {
    initialized,
    user,
    getLoggedUser,
    getFullName,
    fetchUser,
    updateUser,
    updateEmail,
    updatePassword,
    getPhoto,
    uploadPhoto,
    initialize,
  };
});
