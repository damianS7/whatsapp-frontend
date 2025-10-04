import { ApiResponse } from "@/types/response/ApiResponse";
import type { User } from "@/types/User";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const userService = {
  async fetchUser(): Promise<User> {
    const response = await fetch(`${API}/users`, {
      method: "GET",
      headers: authHeader(),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to fetch user.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async fetchProfileImage(userId: number): Promise<Blob> {
    const response = await fetch(`${API}/users/${userId}/image`, {
      method: "GET",
      headers: authHeader(),
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new ApiResponse(
        json.message || "Failed to fetch user profile image.",
        response.status,
        json.errors
      );
    }
    return (await response.blob()) as Blob;
  },
  async uploadProfileImage(currentPassword: string, file: any): Promise<Blob> {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("currentPassword", currentPassword);

    const response = await fetch(`${API}/users/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status !== 201) {
      const json = await response.json();
      throw new ApiResponse(
        json.message || "Failed to upload user profile image.",
        response.status,
        json.errors
      );
    }
    return (await response.blob()) as Blob;
  },
  async updateUser(
    currentPassword: string,
    fieldsToUpdate: Record<string, any>
  ): Promise<User> {
    const response = await fetch(`${API}/users`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ currentPassword, fieldsToUpdate }),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to update user.",
        response.status,
        json.errors
      );
    }

    return json as User;
  },
  async updateEmail(currentPassword: string, newEmail: string): Promise<User> {
    const response = await fetch(`${API}/users/email`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ currentPassword, newEmail }),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to update email.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async updatePassword(currentPassword: string, newPassword: string) {
    const response = await fetch(`${API}/users/password`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new ApiResponse(
        json.message || "Failed to update password.",
        response.status,
        json.errors
      );
    }
  },
};
