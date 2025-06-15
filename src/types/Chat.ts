export const types = ["CONVERSATION", "ROOM"] as const;
export type ChatType = (typeof types)[number];

export interface Chat {
  name: string;
  type: ChatType;
  history: Array<{
    sender: string;
    message: string;
  }>;
  participants: Array<{
    name: string;
  }>;
}
