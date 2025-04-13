import { format } from "date-fns";
import { GroupDomain } from "@/entities/group";

type GroupedMessages = Record<string, GroupDomain.MessageEntity[]>;

export const groupMessagesByDate = (messages: GroupDomain.MessageEntity[]): GroupedMessages => {
	if (!messages.length) return {};

	const grouped: GroupedMessages = {};
	const dateCache = new Map<number, string>();

	const now = Date.now();
	const todayStart = new Date(now);
	todayStart.setHours(0, 0, 0, 0);
	const todayTimestamp = todayStart.getTime();
	const yesterdayTimestamp = todayTimestamp - 86400000;

	for (let i = 0; i < messages.length; i++) {
		const message = messages[i];
		const messageDate = new Date(message.createdAt);

		messageDate.setHours(0, 0, 0, 0);
		const messageTimestamp = messageDate.getTime();

		let label: string;

		if (messageTimestamp === todayTimestamp) {
			label = "Today";
		} else if (messageTimestamp === yesterdayTimestamp) {
			label = "Yesterday";
		} else {
			const cachedLabel = dateCache.get(messageTimestamp);
			if (cachedLabel) {
				label = cachedLabel;
			} else {
				label = format(messageDate, "dd LLLL");
				dateCache.set(messageTimestamp, label);
			}
		}

		grouped[label] ||= [];
		grouped[label].push(message);
	}

	return grouped;
};
