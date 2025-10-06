import type { ChatMessage } from "@/types/ChatMessage";
import type { ChatParticipant } from "./ChatParticipant";

export const types = ["PRIVATE", "GROUP"] as const;
export type ChatType = (typeof types)[number];

export interface Chat {
  id: string;
  type: ChatType;
  groupId?: number;
  userId?: number;
  name: string;
  history: Array<ChatMessage>;
  participants: Array<ChatParticipant>;
  imageUrl?: string;
}
