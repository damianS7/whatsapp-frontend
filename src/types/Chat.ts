import { ChatMessage } from "@/types/ChatMessage";

export const types = ["CONVERSATION", "GROUP"] as const;
export type ChatType = (typeof types)[number];

export interface Chat {
  name: string;
  type: ChatType;
  history: Array<ChatMessage>;
  participants: Array<{
    customerId: number;
    customerName: string;
    customerAvatar: string;
  }>;
}
