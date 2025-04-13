import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/lib/react/use-toast";

export function useEventSource<T>(url: string, onData?: (data: T) => void) {
  const [isPending, setIsPending] = useState(true);
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<unknown | undefined>();
  const [groupName, setGroupName] = useState<string | undefined>();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const groupEvents = new EventSource(url);

    groupEvents.addEventListener("message", (message) => {
      try {
        const parsedData = JSON.parse(message.data);

        if (!parsedData) return;

        if (parsedData.name) {
          setGroupName(parsedData.name);
        }

        if (parsedData.type === "message-created" || parsedData.type === "message-deleted") {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          setData((prev) => {
            if (Array.isArray(prev)) {
              if (parsedData.type === "message-created") {
                return [...prev, parsedData.data];
              } else if (parsedData.type === "message-deleted") {
                return prev.filter((msg) => msg.id !== parsedData.data.messageId);
              }
            }
            return prev;
          });
        } else if (parsedData.type === "group-deleted") {
          toast({
            description: `Group "${groupName}" was deleted`,
            variant: "destructive"
          });
          router.push("/");
        }
        setData(parsedData);
        setError(undefined);
        onData?.(parsedData);
        setIsPending(false);
      } catch (e) {
        console.log(e);
        setError(e);
      }
    });

    groupEvents.addEventListener("error", (e) => {
      console.log(e);
      setError(e);
      groupEvents.close();
    });

    return () => {
      groupEvents.close();
    };
  }, [url, onData, groupName, toast, router]);

  return { dataStream: data, error, isPending, setData };
}
