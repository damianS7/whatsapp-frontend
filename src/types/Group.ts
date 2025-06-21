import { GroupMember } from "./GroupMember";

export interface Group {
  id: number;
  name: string;
  description: string;
  owner: { id: number; name: string; avatarFilename: string };
  members: GroupMember[];
}
