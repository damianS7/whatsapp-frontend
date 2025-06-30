import { useChatStore } from "@/stores/chat";
import { useCustomerStore } from "@/stores/customer";
import { useGroupStore } from "@/stores/group";
import { Chat, ChatType } from "@/types/Chat";
import { ChatMember } from "@/types/ChatMember";
import { ChatMessage } from "@/types/ChatMessage";
import { Contact } from "@/types/Contact";
import { Customer } from "@/types/Customer";
import { Group } from "@/types/Group";

// src/composables/useChat.ts
export function useChat() {
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
        return participant as ChatMember;
      }
    }
    return null;
  };

  const getAvatarFilenameFromChat = (chat: Chat): string => {
    if (chat.type === "GROUP") {
      return chat.avatarFilename || "";
    }

    const destinationCustomer = getDestinationCustomer(chat) as ChatMember;
    if (destinationCustomer) {
      return destinationCustomer.customerAvatarFilename;
    }
    return "";
  };
  const generateChatId = (chatType: ChatType, id: number) => {
    return `${chatType}${id}`;
  };

  const generatePrivateChatId = (contact: Contact) => {
    return generateChatId("PRIVATE", contact.customerId);
  };

  const generateGroupChatId = (group: Group) => {
    return generateChatId("GROUP", group.id);
  };

  const createPrivateChat = (contact: Contact): Chat => {
    const customerStore = useCustomerStore();
    return {
      id: generatePrivateChatId(contact),
      name: contact.name,
      type: "PRIVATE",
      history: [],
      participants: [
        {
          customerId: contact.customerId,
          customerName: contact.name,
          customerAvatarFilename: contact.avatarFilename,
        },
        {
          customerId: customerStore.getLoggedCustomer.id,
          customerName: customerStore.getLoggedCustomer.profile.firstName,
          customerAvatarFilename:
            customerStore.getLoggedCustomer.profile.avatarFilename,
        },
      ],
      avatarFilename: contact.avatarFilename,
    };
  };

  const createGroupChat = (group: Group): Chat => {
    return {
      id: generateGroupChatId(group),
      groupId: group.id,
      name: group.name,
      type: "GROUP",
      history: [],
      participants: group.members,
    };
  };

  const createChatFromMessage = async (message: ChatMessage): Promise<Chat> => {
    const customerStore = useCustomerStore();
    const groupStore = useGroupStore();

    if (message.chatType === "GROUP" && message.groupId) {
      const group = await groupStore.fetchGroup(message.groupId);
      return createGroupChat(group);
    }

    return {
      id: message.chatId,
      name: message.fromCustomerName,
      type: message.chatType,
      history: [],
      participants: [
        {
          customerId: message.fromCustomerId,
          customerName: message.fromCustomerName,
          customerAvatarFilename: "",
        },
        {
          customerId: customerStore.getLoggedCustomer.id,
          customerName: customerStore.getLoggedCustomer.profile.firstName,
          customerAvatarFilename:
            customerStore.getLoggedCustomer.profile.avatarFilename || "",
        },
      ],
    };
  };

  return {
    getDestinationCustomer,
    isLoggedCustomer,
    generateChatId,
    generateGroupChatId,
    generatePrivateChatId,
    getAvatarFilenameFromChat,
    createGroupChat,
    createPrivateChat,
    createChatFromMessage,
  };
}
