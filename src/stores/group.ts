import { defineStore } from "pinia";
import { Group } from "@/types/Group";
import { GroupMember } from "@/types/GroupMember";

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
    async fetchGroup(groupId: number): Promise<Group> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/groups/${groupId}`,
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
          throw new Error("Failed to fetch group. " + jsonResponse.message);
        }

        return (await response.json()) as Group;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to fetch group.");
      }
    },
    async createGroup(group: {
      name: string;
      description: string;
      membersId?: number[];
    }): Promise<Group> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.VUE_APP_API_URL}/groups`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: group.name,
            description: group.description,
            membersId: group.membersId,
          }),
        });

        // if response is not 201, throw an error
        if (response.status !== 201) {
          throw new Error("Failed to create group.");
        }

        const createdGroup = (await response.json()) as Group;
        this.groups.push(createdGroup);
        return createdGroup;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to create group.");
      }
    },
    async updateGroup(
      id: number,
      group: {
        name: string;
        description: string;
        membersId?: number[];
      }
    ): Promise<Group> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/groups/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: group.name,
              description: group.description,
              membersId: group.membersId,
            }),
          }
        );

        // if response is not 200, throw an error
        if (response.status !== 200) {
          throw new Error("Failed to update group.");
        }

        const updatedGroup = (await response.json()) as Group;
        const index = this.groups.findIndex(
          (group) => group.id === updatedGroup.id
        );
        this.groups[index] = updatedGroup;

        return updatedGroup;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to update group.");
      }
    },
    async addGroupMember(id: number, memberId: number): Promise<GroupMember> {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/groups/${id}/members`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              memberId,
            }),
          }
        );

        // if response is not 201, throw an error
        if (response.status !== 201) {
          throw new Error("Failed to add member to group.");
        }

        const groupMember = (await response.json()) as GroupMember;
        const index = this.groups.findIndex(
          (group) => group.id === groupMember.groupId
        );
        this.groups[index].members.push(groupMember);
        return groupMember;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to add member to group.");
      }
    },
    async deleteGroupMember(groupId: number, memberId: number) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/groups/members/${memberId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // if response is not 201, throw an error
        if (response.status !== 204) {
          throw new Error("Failed to delete member from group.");
        }

        const groupIndex = this.groups.findIndex(
          (group) => group.id === groupId
        );
        const gmIndex = this.groups[groupIndex].members.findIndex(
          (groupMember) => groupMember.id === memberId
        );

        this.groups[groupIndex].members.splice(gmIndex, 1);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to delete member from group.");
      }
    },
    async deleteGroup(id: number) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/groups/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(id),
          }
        );

        // if response is not 204, throw an error
        if (response.status !== 204) {
          throw new Error("Failed to delete group.");
        }

        this.groups = this.groups.filter((group) => group.id !== id);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to delete group.");
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
