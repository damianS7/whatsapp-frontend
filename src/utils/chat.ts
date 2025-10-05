import { useUserStore } from "@/stores/user";
import { useGroupStore } from "@/stores/group";
import type { Chat, ChatType } from "@/types/Chat";
import type { Contact } from "@/types/Contact";
import type { Group } from "@/types/Group";
import type { ChatParticipant } from "@/types/ChatParticipant";
import type { ChatMessageRequest } from "@/types/request/ChatMessageRequest";
import type { ChatMessageResponse } from "@/types/response/ChatMessageResponse";

export function chatUtils() {
  const getDestinationUser = (chat: Chat): ChatParticipant | null => {
    for (const participant of chat.participants) {
      if (participant.userId !== useUserStore().getLoggedUser.id) {
        return participant as ChatParticipant;
      }
    }
    return null;
  };

  const getAvatarUrlFromChat = (chat: Chat): string => {
    if (chat.type === "GROUP") {
      return chat.imageUrl || "";
    }

    const destinationCustomer = getDestinationUser(chat) as ChatParticipant;
    if (destinationCustomer && destinationCustomer.avatarUrl) {
      return destinationCustomer.avatarUrl;
    }

    return "";
  };

  const generateChatId = (chatType: ChatType, id: number) => {
    return `${chatType}_${id}`;
  };

  const generatePrivateChatId = (contact: Contact) => {
    return generateChatId("PRIVATE", contact.userId);
  };

  const generateGroupChatId = (group: Group) => {
    return generateChatId("GROUP", group.id);
  };

  const createPrivateChat = (contact: Contact): Chat => {
    const userStore = useUserStore();
    return {
      id: generateChatId("PRIVATE", contact.userId),
      name: contact.name,
      type: "PRIVATE",
      history: [],
      participants: [
        {
          userId: contact.userId,
          userName: contact.name,
          avatarUrl: contact.avatarUrl,
        },
        {
          userId: userStore.getLoggedUser.id,
          userName: userStore.getLoggedUser.firstName,
          avatarUrl: userStore.getLoggedUser.avatarUrl,
        },
      ],
      imageUrl: contact.avatarUrl,
    };
  };

  const createGroupChat = (group: Group): Chat => {
    return {
      id: generateChatId("GROUP", group.id),
      groupId: group.id,
      name: group.name,
      type: "GROUP",
      history: [],
      participants: group.members,
      // imageUrl:
    };
  };

  const createChatFromMessage = async (
    message: ChatMessageResponse
  ): Promise<Chat> => {
    const userStore = useUserStore();
    const groupStore = useGroupStore();

    if (message.chatType === "GROUP" && message.toId) {
      const group = await groupStore.fetchGroup(message.toId);
      return createGroupChat(group);
    }

    return {
      id: generateChatId("PRIVATE", message.toId),
      type: message.chatType,
      userId: message.toId,
      name: message.fromUserName,
      history: [],
      participants: [
        {
          userId: message.fromUserId,
          userName: message.fromUserName,
          avatarUrl: "",
        },
        {
          userId: userStore.getLoggedUser.id,
          userName: userStore.getLoggedUser.firstName,
          avatarUrl: userStore.getLoggedUser.avatarUrl || "",
        },
      ],
    };
  };

  const createMessage = (chat: Chat, message: string): ChatMessageRequest => {
    if (chat.type === "GROUP" && chat.groupId) {
      return {
        chatType: chat.type,
        toId: chat.groupId,
        message,
      };
    }

    if (chat.type === "PRIVATE") {
      const destinationUser = getDestinationUser(chat);
      if (destinationUser) {
        return {
          chatType: chat.type,
          toId: destinationUser.userId,
          message,
        };
      }
    }

    throw new Error("Failed to create chat message");
  };

  return {
    createMessage,
    getDestinationUser,
    generateChatId,
    generateGroupChatId,
    generatePrivateChatId,
    getAvatarFilenameFromChat: getAvatarUrlFromChat,
    createGroupChat,
    createPrivateChat,
    createChatFromMessage,
  };
}
