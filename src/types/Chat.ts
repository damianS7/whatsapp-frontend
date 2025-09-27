import type { ChatMessage } from "@/types/ChatMessage";
import type { ChatMember } from "@/types/ChatMember";
import type { GroupMember } from "@/types/GroupMember";

export const types = ["PRIVATE", "GROUP"] as const;
export type ChatType = (typeof types)[number];

export interface Chat {
  id: string;
  groupId?: number;
  name: string;
  type: ChatType;
  history: Array<ChatMessage>;
  participants: Array<ChatMember | GroupMember>;
  avatarFilename?: string;
}
