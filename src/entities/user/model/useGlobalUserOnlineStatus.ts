"use client";

import { useEffect, useState } from "react";
import {routes} from "@/kernel/routes";

export function useGlobalUserOnlineStatus() {
	const [statuses, setStatuses] = useState<Record<string, boolean>>({});

	useEffect(() => {
		const eventSource = new EventSource(routes.userStatus(), { withCredentials: true });

		const handleMessage = (e: MessageEvent) => {
			try {
				const data = JSON.parse(e.data);
				if (data.type === "user-online" && data.data) {
					setStatuses((prev) => ({
						...prev,
						[data.data.userId]: data.data.isOnline,
					}));
				}
			} catch (error) {
				console.error("Error parsing SSE message:", error);
			}
		};

		eventSource.addEventListener("message", handleMessage);

		eventSource.onerror = (error) => {
			console.error("SSE error:", error);
			eventSource.close();
		};

		return () => {
			eventSource.removeEventListener("message", handleMessage);
			eventSource.close();
		};
	}, []);

	return statuses;
}
