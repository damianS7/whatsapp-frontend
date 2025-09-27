import { defineStore } from "pinia";
import type { User } from "@/types/User";
const API = import.meta.env.VITE_APP_API_URL;
export const useUserStore = defineStore("user", {
  state: () => ({
    user: {} as User,
    initialized: false,
  }),

  getters: {
    getLoggedUser: (state) => {
      return state.user;
    },
    getFullName: (state) => {
      return state.user.firstName + " " + state.user.lastName;
    },
  },

  actions: {
    async getCustomer(): Promise<User> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const jsonResponse = await response.json();
          throw new Error("Failed to fetch user. " + jsonResponse.message);
        }

        return (await response.json()) as User;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to fetch user.");
      }
    },
    async patchProfile(
      currentPassword: string,
      fieldsToUpdate: Record<string, any>
    ): Promise<User> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API}/users`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, fieldsToUpdate }),
        });

        // if response is not 200, throw an error
        if (response.status !== 200) {
          throw new Error("Failed to updated ");
        }

        return (await response.json()) as User;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to update ");
      }
    },
    async patchEmail(currentPassword: string, newEmail: string): Promise<User> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API}/users/email`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newEmail }),
          }
        );

        // if response is not 200, throw an error
        if (response.status !== 200) {
          throw new Error("Failed to update email.");
        }

        return (await response.json()) as User;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to update email.");
      }
    },
    async changePassword(currentPassword: string, newPassword: string) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API}/users/password`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
          }
        );

        // if response is not 200, throw an error
        if (response.status !== 200) {
          throw new Error("Failed to change password.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to change password.");
      }
    },
    async getPhoto(userId?: number): Promise<Blob> {
      if (!userId) {
        userId = this.user.id;
      }

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API}/users/${userId}/image`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // if response is not 200, throw an error
        if (response.status !== 200) {
          throw new Error("Failed to get image.");
        }

        return (await response.blob()) as Blob;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to get image.");
      }
    },
    async uploadPhoto(currentPassword: string, file: any): Promise<Blob> {
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("currentPassword", currentPassword); // otro campo necesario

        const response = await fetch(
          `${API}/users/image`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        // if response is not 201, throw an error
        if (response.status !== 201) {
          throw new Error("Failed to upload image.");
        }

        return (await response.blob()) as Blob;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to upload image");
      }
    },
    async setCustomer(user: any) {
      this.user = user;
    },
    async setEmail(email: string) {
      this.user.email = email;
    },
    async setProfile(profile: any) {
      this.user = profile;
    },
    async setPhoto(image: any) {
      this.user.avatarFilename = ".";
    },
    async initialize() {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      await this.getCustomer()
        .then((user) => {
          this.setCustomer(user);
        })
        .catch((error) => {
          console.log(error);
        });

      if (!this.user.avatarFilename) {
        return;
      }

      await this.getPhoto()
        .then((filename) => {
          localStorage.setItem(
            "profilePhotoURL",
            URL.createObjectURL(filename)
          );
        })
        .catch((error) => {
          console.log(error);
        });

      this.initialized = true;
    },
  },
});
