import type { GroupMember } from "@/types/GroupMember";

export interface Group {
  id: number;
  name: string;
  description: string;
  owner: {
    userId: number;
    userName: string;
    avatarFilename: string;
  };
  // members: ChatMember[];
  members: GroupMember[];
}
