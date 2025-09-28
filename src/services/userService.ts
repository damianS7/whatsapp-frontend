import { ApiError } from "@/types/ApiError";
import type { User } from "@/types/User";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const customerService = {
  async fetchCustomer(): Promise<User> {
    const response = await fetch(`${API}/users`, {
      method: "GET",
      headers: authHeader(),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(json.message || "Failed to fetch customer.", response.status, json.errors);
    }

    return json;
  },

  async updateEmail(currentPassword: string, newEmail: string): Promise<User> {
    const response = await fetch(`${API}/users/email`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ currentPassword, newEmail }),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(json.message || "Failed to update email.", response.status, json.errors);
    }

    return json;
  },

  async updatePassword(currentPassword: string, newPassword: string) {
    const response = await fetch(`${API}/accounts/users/password`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new ApiError(
        json.message || "Failed to update password.",
        response.status,
        json.errors
      );
    }
  },
};
