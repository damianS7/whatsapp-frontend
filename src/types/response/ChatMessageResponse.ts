import type { ChatType } from "@/types/Chat";

export interface ChatMessageResponse {
  chatType: ChatType;
  toId: number;
  fromUserName: string;
  fromUserId: number;
  message: string;
  timestamp: Date;
}
