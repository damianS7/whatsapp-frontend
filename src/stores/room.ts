import { defineStore } from "pinia";
import { Room } from "@/types/Room";

export const useRoomStore = defineStore("room", {
  state: () => ({
    rooms: [{}] as Room[],
    initialized: false,
  }),

  getters: {
    getRooms: (state) => {
      return state.rooms;
    },
  },

  actions: {
    async getRooms(): Promise<Room[]> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.VUE_APP_API_URL}/rooms`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const jsonResponse = await response.json();
          throw new Error("Failed to fetch rooms. " + jsonResponse.message);
        }

        return (await response.json()) as Room[];
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to fetch rooms.");
      }
    },
    async setRooms(rooms: any) {
      this.rooms = rooms;
    },
    async initialize() {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      await this.getRooms()
        .then((rooms) => {
          this.setRooms(rooms);
        })
        .catch((error) => {
          console.log(error);
        });

      this.initialized = true;
    },
  },
});
