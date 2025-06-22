import { ChatType } from "./Chat";

export interface ChatMessage {
  groupId?: number;
  fromCustomerName: string;
  fromCustomerId?: number;
  toCustomerId?: number;
  message: string;
  chatType: ChatType;
  timestamp: Date;
}
