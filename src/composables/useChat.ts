import { useChatStore } from "@/stores/chat";
import { useCustomerStore } from "@/stores/customer";
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

  return {
    getLastMessageFromChat,
    formatMessageDate,
    isLoggedCustomer,
  };
}
