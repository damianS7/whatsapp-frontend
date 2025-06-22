import { ChatMessage } from "@/types/ChatMessage";

export const types = ["PRIVATE", "GROUP"] as const;
export type ChatType = (typeof types)[number];

export interface Chat {
  // GROUP1 ... 1PRIVATE2
  groupId?: number;
  fromCustomerId?: number;
  toCustomerId?: number;
  name: string;
  type: ChatType;
  history: Array<ChatMessage>;
  participants: Array<{
    customerId: number;
    customerName: string;
    customerAvatar: string;
  }>;
}
