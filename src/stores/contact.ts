import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { contactService } from "@/services/contactService";
import { userService } from "@/services/userService";
import type { Contact } from "@/types/Contact";

export const useContactStore = defineStore("contact", () => {
  const contacts = ref<Contact[]>([]);
  const initialized = ref(false);

  const isContact = computed(() => {
    return (userId: number) => {
      return contacts.value.find((contact) => contact.userId === userId)
        ? true
        : false;
    };
  });

  const getContact = computed(() => {
    return (userId: number) => {
      return contacts.value.find((contact) => contact.userId === userId)
        ? true
        : false;
    };
  });

  async function initialize() {
    await fetchContacts().then((fcontacts) => {
      contacts.value = fcontacts;
    });

    initialized.value = true;
  }

  async function fetchContacts(): Promise<Contact[]> {
    const contacts: Contact[] = await contactService.fetchContacts();

    // fetch the profile image for each contact
    for (const contact of contacts) {
      try {
        const resource = await userService.fetchProfileImage(contact.userId);
        contact.avatarUrl = URL.createObjectURL(resource);
      } catch (error) {
        contact.avatarUrl = undefined;
      }
    }

    return contacts;
  }

  async function addContact(id: number) {
    const contact: Contact = await contactService.addContact(id);
    contacts.value.push(contact);
  }

  async function deleteContact(userId: number) {
    await contactService.deleteContact(userId);
    contacts.value = contacts.value.filter(
      (contact) => contact.userId !== userId
    );
  }

  return {
    contacts,
    initialized,
    isContact,
    initialize,
    fetchContacts,
    getContact,
    addContact,
    deleteContact,
  };
});
