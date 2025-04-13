import { routes } from "@/kernel/routes";
import { useEffect, useState } from "react";

export function useHeartbeatSSE() {
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let eventSource: EventSource;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      eventSource = new EventSource(routes.userStatus(), {
        withCredentials: true,
      });

      eventSource.onopen = () => {
        setRetryCount(0);
      };

      eventSource.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === "ping") {
          fetch(routes.userStatus(), { method: "PATCH" }).catch((error) =>
            console.error("Ping failed:", error),
          );
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        const timeout = Math.min(1000 * 2 ** retryCount, 30000);
        reconnectTimeout = setTimeout(() => {
          setRetryCount((c) => c + 1);
          connect();
        }, timeout);
      };
    };

    connect();

    return () => {
      eventSource?.close();
      clearTimeout(reconnectTimeout);
    };
  }, [retryCount]);
}
