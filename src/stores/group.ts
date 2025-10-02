import { defineStore } from "pinia";
import type { Group } from "@/types/Group";
import { computed, ref } from "vue";
import { groupService } from "@/services/groupService";
import { userService } from "@/services/userService";
import type { GroupMember } from "@/types/GroupMember";

export const useGroupStore = defineStore("group", () => {
  const groups = ref<Group[]>([]);
  const initialized = ref(false);

  const getGroup = computed(() => {
    return (id: number) => {
      return groups.value.find((group) => group.id === id);
    };
  });

  async function fetchGroups(): Promise<Group[]> {
    const groups: Group[] = await groupService.fetchGroups();

    for (const group of groups) {
      for (const groupMember of group.members) {
        try {
          const resource = await userService.fetchProfileImage(
            groupMember.userId
          );

          groupMember.avatarSrc = URL.createObjectURL(resource);
        } catch (error) {
          groupMember.avatarSrc = undefined;
        }
      }
    }

    return groups;
  }

  async function fetchGroup(groupId: number): Promise<Group> {
    return await groupService.fetchGroup(groupId);
  }

  async function createGroup(group: {
    name: string;
    description: string;
    membersId?: number[];
  }): Promise<Group> {
    const createdGroup = await groupService.createGroup(group);
    groups.value.push(createdGroup);
    return createdGroup;
  }

  async function deleteGroup(groupId: number) {
    await groupService.deleteGroup(groupId);
    groups.value = groups.value.filter((group) => group.id !== groupId);
  }

  async function updateGroup(
    id: number,
    group: {
      name: string;
      description: string;
      membersId?: number[];
    }
  ): Promise<Group> {
    const updatedGroup: Group = await groupService.updateGroup(id, group);

    const index = groups.value.findIndex(
      (group) => group.id === updatedGroup.id
    );

    groups.value[index] = updatedGroup;

    return updatedGroup;
  }

  async function addGroupMember(
    groupId: number,
    userId: number
  ): Promise<GroupMember> {
    const groupMember: GroupMember = await groupService.addGroupMember(
      groupId,
      userId
    );

    const index = groups.value.findIndex(
      (group) => group.id === groupMember.groupId
    );
    groups.value[index].members.push(groupMember);
    return groupMember;
  }

  async function deleteGroupMember(groupId: number, userId: number) {
    await groupService.deleteGroupMember(groupId, userId);
    const groupIndex = groups.value.findIndex((group) => group.id === groupId);
    const gmIndex = groups.value[groupIndex].members.findIndex(
      (groupMember) => groupMember.userId === userId
    );

    groups.value[groupIndex].members.splice(gmIndex, 1);
  }

  async function initialize() {
    await fetchGroups().then((fgroups) => {
      groups.value = fgroups;
    });

    initialized.value = true;
  }

  return {
    initialize,
    createGroup,
    deleteGroup,
    updateGroup,
    addGroupMember,
    deleteGroupMember,
    fetchGroup,
    fetchGroups,
    initialized,
    groups,
    getGroup,
  };
});
