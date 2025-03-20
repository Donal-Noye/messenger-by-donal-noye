import { format, isToday, isYesterday } from "date-fns";
import { GroupDomain } from "@/entities/group";

type GroupedMessages = Record<string, GroupDomain.MessageEntity[]>;

export const groupMessagesByDate = (messages: GroupDomain.MessageEntity[]): GroupedMessages => {
	if (!messages.length) return {};

	const grouped: GroupedMessages = {};

	messages.forEach((message) => {
		const date = new Date(message.createdAt);

		let label;
		if (isToday(date)) {
			label = "Today";
		} else if (isYesterday(date)) {
			label = "Yesterday";
		} else {
			label = format(date, "dd LLLL");
		}

		if (!grouped[label]) {
			grouped[label] = [];
		}
		grouped[label].push(message);
	});

	return grouped;
};
