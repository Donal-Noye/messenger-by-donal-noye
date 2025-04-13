import { GroupDomain } from "@/entities/group";
import { EventsChannel } from "@/shared/lib/events";

type GroupChanged = {
  type: "group-changed";
  data: GroupDomain.GroupEntity;
};
type GroupCreated = {
  type: "group-created";
};
type GroupDeleted = {
  type: "group-deleted";
  data: { groupId: string };
};
type GroupMemberAdd = {
  type: "member-added";
  data: {
    groupId: string;
    member: GroupDomain.MemberEntity;
  };
};
type MemberRemoved = {
  type: "member-removed";
  data: { groupId: string; memberId: string };
};
type GroupEvent =
  | GroupChanged
  | GroupCreated
  | GroupDeleted
  | GroupMemberAdd
  | MemberRemoved;

class GroupEventsService {
  eventsChannel = new EventsChannel("group");

  async addGroupChangedListener(listener: (event: GroupChanged) => void) {
    return this.eventsChannel.concume("group-changed", (data) => {
      listener(data as GroupChanged);
    });
  }

  async addGroupCreatedListener(listener: (event: GroupCreated) => void) {
    return this.eventsChannel.concume("group-created", (data) => {
      listener(data as GroupCreated);
    });
  }

  async addGroupDeletedListener(listener: (event: GroupDeleted) => void) {
    return this.eventsChannel.concume("group-deleted", (data) => {
      listener(data as GroupDeleted);
    });
  }

  async addMemberAddedListener(
    groupId: string,
    listener: (event: GroupMemberAdd) => void,
  ) {
    return this.eventsChannel.concume(groupId, (data) => {
      listener(data as GroupMemberAdd);
    });
  }

  async addMemberDeletedListener(groupId: string, listener: (event: MemberRemoved) => void) {
    return this.eventsChannel.concume(groupId, (data) => {
      listener(data as MemberRemoved);
    });
  }

  emit(event: GroupEvent) {
    switch (event.type) {
      case "group-changed":
        return this.eventsChannel.emit("group-changed", event);
      case "group-created":
        return this.eventsChannel.emit("group-created", event);
      case "group-deleted":
        return this.eventsChannel.emit("group-deleted", event);
      case "member-added":
        return this.eventsChannel.emit(event.data.groupId, event);
      case "member-removed":
        return this.eventsChannel.emit(event.data.groupId, event);
    }
  }
}

export const groupEvents = new GroupEventsService();
