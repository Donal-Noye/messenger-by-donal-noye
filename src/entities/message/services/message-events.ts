import { GroupDomain } from "@/entities/group";
import { EventsChannel } from "@/shared/lib/events";

type MessageUpdated = {
  type: "message-updated";
  data: { content: string };
};
type MessageCreated = {
  type: "message-created";
  data: GroupDomain.MessageEntity;
};
type MessageDeleted = {
  type: "message-deleted";
  data: { messageId: string };
};
type TypingEvent = {
  type: "typing";
  data: { userId: string; groupId: string; isTyping: boolean };
};
type MessageEvent =
  | MessageUpdated
  | MessageCreated
  | TypingEvent
  | MessageDeleted;

class MessageEventsService {
  eventsChannel = new EventsChannel("message");

  async addMessageUpdatedListener(
    groupId: string,
    listener: (event: MessageUpdated) => void,
  ) {
    return this.eventsChannel.concume(groupId, (data) => {
      listener(data as MessageUpdated);
    });
  }

  async addMessageCreatedListener(
    groupId: string,
    listener: (event: MessageCreated) => void,
  ) {
    return this.eventsChannel.concume(groupId, (data) => {
      listener(data as MessageCreated);
    });
  }

  async addMessageDeletedListener(listener: (event: MessageDeleted) => void) {
    return this.eventsChannel.concume("message-deleted", (data) => {
      listener(data as MessageDeleted);
    });
  }

  async addTypingListener(
    groupId: string,
    listener: (event: TypingEvent) => void,
  ) {
    return this.eventsChannel.concume(groupId, (data) => {
      listener(data as TypingEvent);
    });
  }

  emit(event: MessageEvent) {
    if (event.type === "message-updated") {
      return this.eventsChannel.emit("message-updated", event);
    }

    if (event.type === "message-created") {
      return this.eventsChannel.emit(event.data.groupId, event);
    }

    if (event.type === "message-deleted") {
      return this.eventsChannel.emit("message-deleted", event);
    }

    if (event.type === "typing") {
      return this.eventsChannel.emit(event.data.groupId, event);
    }
  }
}

export const messageEvents = new MessageEventsService();
