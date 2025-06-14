import { defineStore } from "pinia";
import type { Friend } from "@/types/Friend";

export const useFriendStore = defineStore("friend", {
  state: () => ({
    friends: [{}] as Friend[],
    initialized: false,
  }),

  getters: {
    getFriends: (state) => {
      return state.friends;
    },
  },

  actions: {
    async fetchFriends(): Promise<Friend[]> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.VUE_APP_API_URL}/friends`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const jsonResponse = await response.json();
          throw new Error("Failed to fetch friends. " + jsonResponse.message);
        }

        return (await response.json()) as Friend[];
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to fetch friends.");
      }
    },
    async getPhoto(filename: string): Promise<Blob> {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/customers/{id}/profile/photo/${filename}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const json = await response.json();
          throw new Error(json?.message || "Failed to get photo.");
        }

        return (await response.blob()) as Blob;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Failed to get photo. Unknown error.");
        }
      }
    },
    async setFriends(friends: any) {
      this.friends = friends;
    },
    async initialize() {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      await this.fetchFriends()
        .then((friends) => {
          this.setFriends(friends);
        })
        .catch((error) => {
          console.log(error);
        });

      this.initialized = true;
    },
  },
});
