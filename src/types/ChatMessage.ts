import { ChatType } from "./Chat";

export interface ChatMessage {
  chatId: string;
  groupId?: number;
  fromCustomerName: string;
  fromCustomerId: number;
  toCustomerId?: number;
  message: string;
  chatType: ChatType;
  timestamp: Date;
}
