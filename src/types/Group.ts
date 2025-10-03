import type { GroupMember } from "./GroupMember";

export interface Group {
  id: number;
  name: string;
  description: string;
  owner: {
    userId: number;
    userName: string;
    avatarFilename: string;
  };
  members: GroupMember[];
}
