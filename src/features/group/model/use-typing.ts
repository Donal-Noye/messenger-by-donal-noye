"use client";

import { useEffect, useState } from "react";

export interface TypingEvent {
  type: "typing";
  data: {
    userId: string;
    isTyping: boolean;
  };
}

export function useTyping(typingEvents: TypingEvent) {
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typingEvents?.type === "typing") {
      setTypingUsers((prev) => {
        const updatedUsers = {
          ...prev,
          [typingEvents.data.userId]: typingEvents.data.isTyping,
        };

        if (!typingEvents.data.isTyping) {
          setTypingUsers((prev) => {
            const newState = { ...prev };
            delete newState[typingEvents.data.userId];
            return newState;
          });
        }

        return updatedUsers;
      });
    }
  }, [typingEvents]);

  return { typingUsers };
}
