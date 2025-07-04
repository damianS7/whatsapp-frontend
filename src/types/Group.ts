import { ChatMember } from "./ChatMember";
import { GroupMember } from "./GroupMember";

export interface Group {
  id: number;
  name: string;
  description: string;
  owner: {
    customerId: number;
    customerName: string;
    avatarFilename: string;
  };
  // members: ChatMember[];
  members: GroupMember[];
}
