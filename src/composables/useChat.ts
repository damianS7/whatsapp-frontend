import { useCustomerStore } from "@/stores/customer";
import { Chat, ChatType } from "@/types/Chat";
import { ChatMember } from "@/types/ChatMember";
import { ChatMessage } from "@/types/ChatMessage";
import { Customer } from "@/types/Customer";

// src/composables/useChat.ts
export function useChat() {
  const getLastMessageFromChat = () => {
    //
  };

  const formatMessageDate = (message: ChatMessage) => {
    // return message.datetime.toLocaleDateString({
    //   year: 2,
    // });
  };

  const isLoggedCustomer = (customerId: number) => {
    const customer: Customer = useCustomerStore().getLoggedCustomer;
    if (customer.id === customerId) {
      return true;
    }

    return false;
  };

  const getDestinationCustomer = (chat: Chat): ChatMember | null => {
    for (const participant of chat.participants) {
      if (participant.customerId !== useCustomerStore().getLoggedCustomer.id) {
        return participant;
      }
    }
    return null;
  };

  const getAvatarFilenameFromChat = (chat: Chat): string => {
    if (chat.type === "GROUP") {
      return "";
    }
    const destinationCustomer = getDestinationCustomer(chat) as ChatMember;
    if (destinationCustomer) {
      return destinationCustomer.customerAvatarFilename;
    }
    return "";
  };

  const generateChatId = (chatType: ChatType, id: number) => {
    return chatType === "PRIVATE" ? `PRIVATE${id}` : `GROUP${id}`;
  };

  return {
    getDestinationCustomer,
    getLastMessageFromChat,
    formatMessageDate,
    isLoggedCustomer,
    generateChatId,
    getAvatarFilenameFromChat,
  };
}
