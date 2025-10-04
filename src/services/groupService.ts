import { ApiResponse } from "@/types/response/ApiResponse";
import type { Group } from "@/types/Group";
import type { GroupMember } from "@/types/GroupMember";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const groupService = {
  async fetchGroups(): Promise<Group[]> {
    const response = await fetch(`${API}/groups`, {
      method: "GET",
      headers: authHeader(),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to fetch groups.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async fetchGroup(groupId: number): Promise<Group> {
    const response = await fetch(`${API}/groups/${groupId}`, {
      method: "GET",
      headers: authHeader(),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to fetch group.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async createGroup(group: {
    name: string;
    description: string;
    membersId?: number[];
  }): Promise<Group> {
    const response = await fetch(`${API}/groups`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({
        name: group.name,
        description: group.description,
        membersId: group.membersId,
      }),
    });

    const json = await response.json();

    if (response.status !== 201) {
      throw new ApiResponse(
        json.message || "Failed to create group.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async deleteGroup(groupId: number) {
    const response = await fetch(`${API}/groups/${groupId}`, {
      method: "DELETE",
      headers: authHeader(),
      body: JSON.stringify(groupId),
    });

    if (response.status !== 204) {
      const json = await response.json();
      throw new ApiResponse(
        json.message || "Failed to delete group.",
        response.status,
        json.errors
      );
    }
  },
  async updateGroup(
    groupId: number,
    group: {
      name: string;
      description: string;
      membersId?: number[];
    }
  ): Promise<Group> {
    const response = await fetch(`${API}/groups/${groupId}`, {
      method: "PUT",
      headers: authHeader(),
      body: JSON.stringify({
        name: group.name,
        description: group.description,
        membersId: group.membersId,
      }),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiResponse(
        json.message || "Failed to update group.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async addGroupMember(id: number, memberId: number): Promise<GroupMember> {
    const response = await fetch(`${API}/groups/${id}/members`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({
        memberId,
      }),
    });

    const json = await response.json();

    if (response.status !== 201) {
      throw new ApiResponse(
        json.message || "Failed to add group member.",
        response.status,
        json.errors
      );
    }

    return json;
  },
  async deleteGroupMember(groupId: number, userId: number) {
    const response = await fetch(`${API}/groups/${groupId}/members/${userId}`, {
      method: "DELETE",
      headers: authHeader(),
    });

    if (response.status !== 204) {
      const json = await response.json();
      throw new ApiResponse(
        json.message || "Failed to delete member from group.",
        response.status,
        json.errors
      );
    }
  },
};
