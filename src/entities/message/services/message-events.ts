import { GroupDomain } from "@/entities/group";
import { EventsChannel } from "@/shared/lib/events";

type MessageChanged = {
  type: "message-changed";
  data: GroupDomain.MessageEntity;
};
type MessageCreated = {
  type: "message-created";
  data: GroupDomain.MessageEntity;
};
type TypingEvent = {
  type: "typing";
  data: { userId: string; groupId: string; isTyping: boolean };
};
type MessageEvent = MessageChanged | MessageCreated | TypingEvent;

class MessageEventsService {
  eventsChannel = new EventsChannel("message");

  async addMessageChangedListener(
    groupId: string,
    listener: (event: MessageChanged) => void,
  ) {
    return this.eventsChannel.concume(groupId, (data) => {
      listener(data as MessageChanged);
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

  async addTypingListener(groupId: string, listener: (event: TypingEvent) => void) {
    return this.eventsChannel.concume(groupId, (data) => {
      listener(data as TypingEvent);
    });
  }

  emit(event: MessageEvent) {
    if (event.type === "message-changed") {
      return this.eventsChannel.emit(event.data.id, event);
    }

    if (event.type === "message-created") {
      return this.eventsChannel.emit(event.data.groupId, event);
    }

    if (event.type === "typing") {
      return this.eventsChannel.emit(event.data.groupId, event);
    }
  }
}

export const messageEvents = new MessageEventsService();
