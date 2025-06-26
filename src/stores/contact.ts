import { defineStore } from "pinia";
import type { Contact } from "@/types/Contact";

export const useContactStore = defineStore("contact", {
  state: () => ({
    contacts: [{}] as Contact[],
    initialized: false,
  }),

  getters: {
    getContacts: (state) => {
      return state.contacts;
    },
    isContact: (state) => {
      return (customerId: number) => {
        return state.contacts.find(
          (contact) => contact.customerId === customerId
        )
          ? true
          : false;
      };
    },
  },

  actions: {
    async fetchContacts(): Promise<Contact[]> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/contacts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const jsonResponse = await response.json();
          throw new Error("Failed to fetch contacts. " + jsonResponse.message);
        }

        return (await response.json()) as Contact[];
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to fetch contacts.");
      }
    },
    async deleteContact(id: number) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/contacts/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // if response is not 204, throw an error
        if (response.status !== 204) {
          throw new Error("Failed to delete contact.");
        }

        // remove contact from state
        this.contacts = this.contacts.filter((contact) => contact.id !== id);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to delete contact.");
      }
    },
    async addContact(id: number) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/contacts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              customerId: id,
            }),
          }
        );

        // if response is not 201, throw an error
        if (response.status !== 201) {
          throw new Error("Failed to add contact.");
        }
        const createdContact = (await response.json()) as Contact;
        this.contacts.push(createdContact);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to add contact.");
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
          throw error;
        }
        throw new Error("Failed to get photo. Unknown error.");
      }
    },
    async setContacts(contacts: any) {
      this.contacts = contacts;
    },
    async initialize() {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      await this.fetchContacts()
        .then((contacts) => {
          this.setContacts(contacts);
        })
        .catch((error) => {
          console.log(error);
        });

      this.initialized = true;
    },
  },
});
