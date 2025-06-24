import { ChatMember } from "./ChatMember";

export interface Group {
  id: number;
  name: string;
  description: string;
  owner: {
    customerId: number;
    customerName: string;
    avatarFilename: string;
  };
  members: ChatMember[];
}
