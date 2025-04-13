"use client"

import {useHeartbeatSSE} from "@/features/user";

export function HeartbeatProvider() {
	useHeartbeatSSE();
	return null;
}