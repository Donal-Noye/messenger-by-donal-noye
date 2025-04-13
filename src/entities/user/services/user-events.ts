import { EventsChannel } from "@/shared/lib/events";

type UserOnlineEvent = {
	type: "user-online";
	data: {
		userId: string;
		isOnline: boolean;
	};
};

class UserEventsService {
	eventsChannel = new EventsChannel("user");

	async addUserOnlineListener(
		listener: (event: UserOnlineEvent) => void,
	) {
		return this.eventsChannel.concume("user-online", (data) => {
			listener(data as UserOnlineEvent);
		});
	}

	emit(event: UserOnlineEvent) {
		return this.eventsChannel.emit("user-online", event);
	}
}

export const userEvents = new UserEventsService();
