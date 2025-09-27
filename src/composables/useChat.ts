import { useChatStore } from "@/stores/chat";
import { useUserStore } from "@/stores/user";
import { useGroupStore } from "@/stores/group";
import type { Chat, ChatType } from "@/types/Chat";
import type { ChatMember } from "@/types/ChatMember";
import type { ChatMessage } from "@/types/ChatMessage";
import type { Contact } from "@/types/Contact";
import type { User } from "@/types/User";
import type { Group } from "@/types/Group";

// src/composables/useChat.ts
export function useChat() {
  const isLoggedUser = (userId: number) => {
    const user: User = useUserStore().getLoggedUser;
    if (user.id === userId) {
      return true;
    }
    return false;
  };

  const getDestinationUser = (chat: Chat): ChatMember | null => {
    for (const participant of chat.participants) {
      if (participant.userId !== useUserStore().getLoggedUser.id) {
        return participant as ChatMember;
      }
    }
    return null;
  };

  const getAvatarFilenameFromChat = (chat: Chat): string => {
    if (chat.type === "GROUP") {
      return chat.avatarFilename || "";
    }

    const destinationCustomer = getDestinationUser(chat) as ChatMember;
    if (destinationCustomer) {
      return destinationCustomer.userAvatarFilename;
    }
    return "";
  };
  const generateChatId = (chatType: ChatType, id: number) => {
    return `${chatType}${id}`;
  };

  const generatePrivateChatId = (contact: Contact) => {
    return generateChatId("PRIVATE", contact.userId);
  };

  const generateGroupChatId = (group: Group) => {
    return generateChatId("GROUP", group.id);
  };

  const createPrivateChat = (contact: Contact): Chat => {
    const customerStore = useUserStore();
    return {
      id: generatePrivateChatId(contact),
      name: contact.name,
      type: "PRIVATE",
      history: [],
      participants: [
        {
          userId: contact.userId,
          userName: contact.name,
          userAvatarFilename: contact.avatarFilename,
        },
        {
          userId: customerStore.getLoggedUser.id,
          userName: customerStore.getLoggedUser.firstName,
          userAvatarFilename: customerStore.getLoggedUser.avatarFilename,
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
    const customerStore = useUserStore();
    const groupStore = useGroupStore();

    if (message.chatType === "GROUP" && message.groupId) {
      const group = await groupStore.fetchGroup(message.groupId);
      return createGroupChat(group);
    }

    return {
      id: message.chatId,
      name: message.fromUserName,
      type: message.chatType,
      history: [],
      participants: [
        {
          userId: message.fromUserId,
          userName: message.fromUserName,
          userAvatarFilename: "",
        },
        {
          userId: customerStore.getLoggedUser.id,
          userName: customerStore.getLoggedUser.firstName,
          userAvatarFilename: customerStore.getLoggedUser.avatarFilename || "",
        },
      ],
    };
  };

  return {
    getDestinationUser,
    isLoggedUser,
    generateChatId,
    generateGroupChatId,
    generatePrivateChatId,
    getAvatarFilenameFromChat,
    createGroupChat,
    createPrivateChat,
    createChatFromMessage,
  };
}
