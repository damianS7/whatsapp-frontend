import { defineStore } from "pinia";
import type { Contact } from "@/types/Contact";
import { contactService } from "@/services/contactService";
import { computed, ref } from "vue";
import { userService } from "@/services/userService";

export const useContactStore = defineStore("contact", () => {
  const contacts = ref([{}] as Contact[]);
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
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    await fetchContacts()
      .then((fcontacts) => {
        contacts.value = fcontacts;
      })
      .catch((error) => {
        console.log(error);
      });

    initialized.value = true;
  }

  async function fetchContacts(): Promise<Contact[]> {
    const contacts = await contactService.fetchContacts();

    // TODO .then .catch
    // createUrl for each contact image
    for (const contact of contacts) {
      // fetch the photo
      try {
        const resource = await userService.fetchProfileImage(contact.userId);
        contact.avatarUrl = URL.createObjectURL(resource);
      } catch (error) {
        // contact.avatarUrl = "/default-avatar.jpg";
      }
    }

    return contacts;
  }

  async function deleteContact(id: number) {
    await contactService.deleteContact(id);
    contacts.value = contacts.value.filter((contact) => contact.id !== id);
  }

  async function addContact(id: number) {
    const contact: Contact = await contactService.addContact(id);
    contacts.value.push(contact);
  }

  return { contacts, initialized, isContact, initialize, fetchContacts, deleteContact, addContact };
});
