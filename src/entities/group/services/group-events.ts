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
type GroupEvent = GroupChanged | GroupCreated | GroupDeleted | GroupMemberAdd;

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

  emit(event: GroupEvent) {
    if (event.type === "group-changed") {
      return this.eventsChannel.emit("group-changed", event);
    }

    if (event.type === "group-created") {
      return this.eventsChannel.emit("group-created", event);
    }

    if (event.type === "group-deleted") {
      return this.eventsChannel.emit("group-deleted", event);
    }

    if (event.type === "member-added") {
      return this.eventsChannel.emit(event.data.groupId, event);
    }
  }
}

export const groupEvents = new GroupEventsService();
