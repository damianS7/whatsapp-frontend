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
    return await userService.fetchUser();
  }

  async function updateUser(currentPassword: string, fieldsToUpdate: Record<string, any>): Promise<User> {
    const updatedUser = await userService.updateUser(currentPassword, fieldsToUpdate);
    user.value = updatedUser;
    return updatedUser;
  }

  async function updateEmail(currentPassword: string, newEmail: string): Promise<User> {
    const updatedUser = await userService.updateEmail(currentPassword, newEmail);
    user.value = updatedUser;
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

  async function uploadPhoto(currentPassword: string, file: any): Promise<Blob> {
    return await userService.uploadProfileImage(currentPassword, file);
  }

  async function initialize() {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    await fetchUser()
      .then((fuser) => {
        user.value = fuser;
      })
      .catch((error) => {
        console.log(error);
      });

    if (!user.value.avatarFilename) {
      return;
    }

    await getPhoto()
      .then((filename) => {
        localStorage.setItem(
          "profilePhotoURL",
          URL.createObjectURL(filename)
        );
      })
      .catch((error) => {
        console.log(error);
      });

    initialized.value = true;
  }

  return { initialized, user, getLoggedUser, getFullName, fetchUser, updateUser, updateEmail, updatePassword, getPhoto, uploadPhoto, initialize }
});
