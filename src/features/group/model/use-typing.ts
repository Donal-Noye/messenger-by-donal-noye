"use client";

import { useEffect, useState } from "react";

export interface TypingEvent {
  type: "typing";
  data: {
    userId: string;
    isTyping: boolean;
  };
}

export function useTyping(typingEvent: TypingEvent | undefined) {
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typingEvent?.type === "typing") {
      setTypingUsers((prev) => {
        const newState = { ...prev };
        if (typingEvent.data.isTyping) {
          newState[typingEvent.data.userId] = true;
        } else {
          delete newState[typingEvent.data.userId];
        }
        return newState;
      });
    }
  }, [typingEvent]);

  return { typingUsers };
}
