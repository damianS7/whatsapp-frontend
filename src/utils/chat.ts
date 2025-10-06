import { useUserStore } from "@/stores/user";
import { useGroupStore } from "@/stores/group";
import type { Chat, ChatType } from "@/types/Chat";
import type { Contact } from "@/types/Contact";
import type { Group } from "@/types/Group";
import type { ChatMessageRequest } from "@/types/request/ChatMessageRequest";
import type { ChatMessageResponse } from "@/types/response/ChatMessageResponse";
import { authUtils } from "./auth";
const { isLoggedUser } = authUtils();

export function chatUtils() {
  const generateChatIdFromMessage = (message: ChatMessageResponse): string => {
    let id = message.toId;

    if (message.chatType === "PRIVATE") {
      if (!isLoggedUser(message.fromUserId)) {
        id = message.fromUserId;
      }
    }

    return generateChatId(message.chatType, id);
  };

  const generateChatId = (chatType: ChatType, id: number) => {
    return `${chatType}_${id}`;
  };

  const getPrivateChatId = (contact: Contact) => {
    return generateChatId("PRIVATE", contact.userId);
  };

  const getGroupChatId = (group: Group) => {
    return generateChatId("GROUP", group.id);
  };

  const createChatFromContact = (contact: Contact): Chat => {
    const userStore = useUserStore();
    return {
      id: getPrivateChatId(contact),
      userId: contact.userId,
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

  const createChatFromGroup = (group: Group): Chat => {
    return {
      id: getGroupChatId(group),
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
    const groupStore = useGroupStore();

    if (message.chatType === "GROUP" && message.toId) {
      const group = await groupStore.fetchGroup(message.toId);
      return createChatFromGroup(group);
    }

    return createChatFromContact({
      userId: message.fromUserId,
      name: message.fromUserName,
      avatarUrl: "",
    });
  };

  const createMessage = (chat: Chat, message: string): ChatMessageRequest => {
    const toId = chat.groupId ?? chat.userId;
    if (!toId) {
      throw new Error("Failed to create message from chat");
    }

    return {
      chatType: chat.type,
      toId,
      message,
    };
  };

  return {
    createMessage,
    generateChatId,
    getGroupChatId,
    getPrivateChatId,
    generateChatIdFromMessage,
    createGroupChat: createChatFromGroup,
    createPrivateChat: createChatFromContact,
    createChatFromMessage,
  };
}
