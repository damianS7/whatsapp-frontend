import { defineStore } from "pinia";
import { Group } from "@/types/Group";

export const useGroupStore = defineStore("group", {
  state: () => ({
    groups: [] as Group[],
    initialized: false,
  }),

  getters: {
    getGroups: (state) => {
      return state.groups;
    },
    getGroup: (state) => {
      return (id: number) => {
        return state.groups.find((group) => group.id === id);
      };
    },
  },

  actions: {
    async fetchGroups(): Promise<Group[]> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.VUE_APP_API_URL}/groups`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const jsonResponse = await response.json();
          throw new Error("Failed to fetch groups. " + jsonResponse.message);
        }

        return (await response.json()) as Group[];
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to fetch groups.");
      }
    },
    async setGroups(groups: Group[]) {
      this.groups = groups;
    },
    async initialize() {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      await this.fetchGroups()
        .then((groups) => {
          this.setGroups(groups);
        })
        .catch((error) => {
          console.log(error);
        });

      this.initialized = true;
    },
  },
});
