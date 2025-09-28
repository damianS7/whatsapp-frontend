import { defineStore } from "pinia";
import type { Contact } from "@/types/Contact";
const API = import.meta.env.VITE_APP_API_URL;
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
      return (userId: number) => {
        return state.contacts.find((contact) => contact.userId === userId)
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
          `${API}/contacts`,
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
          `${API}/contacts/${id}`,
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
          `${API}/contacts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: id,
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
