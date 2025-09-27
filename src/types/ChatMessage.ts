import type { ChatType } from "./Chat";

export interface ChatMessage {
  chatId: string;
  groupId?: number;
  fromUserName: string;
  fromUserId: number;
  toUserId?: number;
  message: string;
  chatType: ChatType;
  timestamp: Date;
}
