// Пример SSE endpoint-а (app/api/user/online/route.ts)
import { NextRequest, NextResponse } from "next/server";
import { sseStream } from "@/shared/lib/sse/server";
import { getCurrentUser } from "@/entities/user/server";
import { updateOnlineStatus } from "@/entities/user/services/update-online-status";
import { userEvents } from "@/entities/user/services/user-events";

export const getOnlineStatus = async (req: NextRequest) => {
	const user = await getCurrentUser();
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { response, write, addCloseListener, close } = sseStream(req);

	// Обновляем статус на online и эмитируем событие
	await updateOnlineStatus(user.id, true);
	await userEvents.emit({
		type: "user-online",
		data: { userId: user.id, isOnline: true },
	});
	// Записываем первое событие в поток
	write({
		type: "user-online",
		data: { userId: user.id, isOnline: true },
	});

	// Пинг-событие для поддержания соединения
	const pingInterval = setInterval(() => {
		write({ type: "ping", timestamp: Date.now() });
	}, 30000);

	const unsubscribe = await userEvents.addUserOnlineListener(async (event) => {
		if (event.data.userId === user.id) {
			write({
				type: "user-online",
				data: event.data,
			});
		}
	});

	addCloseListener(async () => {
		clearInterval(pingInterval);
		unsubscribe();
		await updateOnlineStatus(user.id, false);
		await userEvents.emit({
			type: "user-online",
			data: { userId: user.id, isOnline: false },
		});
		close();
	});

	return response;
};
