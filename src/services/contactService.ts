import { ApiError } from "@/types/ApiError";
import type { Contact } from "@/types/Contact";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const contactService = {
  async fetchContacts(): Promise<Contact[]> {
    const response = await fetch(`${API}/contacts`, {
      method: "GET",
      headers: authHeader(),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(
        json.message || "Failed to fetch contacts.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async addContact(userId: number): Promise<Contact> {
    const response = await fetch(`${API}/contacts`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ userId }),
    });

    const json = await response.json();

    if (response.status !== 201) {
      throw new ApiError(
        json.message || "Failed to add contact.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async deleteContact(userId: number): Promise<void> {
    const response = await fetch(`${API}/contacts/${userId}`, {
      method: "DELETE",
      headers: authHeader(),
    });

    if (response.status !== 204) {
      const json = await response.json();
      throw new ApiError(
        json.message || "Failed to delete contact.",
        response.status,
        json.errors
      );
    }
  },
};
