"use client";

import { useEffect } from "react";
import {routes} from "@/kernel/routes";

export function useHeartbeat(intervalMs = 10000) {
	useEffect(() => {
		const sendHeartbeat = async () => {
			try {
				await fetch(routes.userStatus(), {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ isOnline: true }),
				});
			} catch (error) {
				console.error("Heartbeat failed", error);
			}
		};

		sendHeartbeat();
		const interval = setInterval(sendHeartbeat, intervalMs);

		return () => {
			clearInterval(interval);
		};
	}, [intervalMs]);

	useEffect(() => {
		const goOffline = () => {
			navigator.sendBeacon(routes.userStatus(), JSON.stringify({ isOnline: false }));
		};

		window.addEventListener("beforeunload", goOffline);
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "hidden") {
				goOffline();
			}
		});

		return () => {
			window.removeEventListener("beforeunload", goOffline);
			document.removeEventListener("visibilitychange", goOffline);
		};
	}, []);
}
