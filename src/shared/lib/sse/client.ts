import { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import {useToast} from "@/shared/lib/react/use-toast";

export function useEventSource<T>(url: string, onData?: (data: T) => void) {
  const [isPending, setIsPending] = useState(true);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown | undefined>();
  const [groupName, setGroupName] = useState<string | undefined>();
  const router = useRouter();
  const { toast } = useToast()

  useEffect(() => {
    const groupEvents = new EventSource(url);

    groupEvents.addEventListener("message", (message) => {
      try {
        const data = JSON.parse(message.data);

        if (data.type === "group-deleted") {
          toast({
            description: `Group "${groupName}" was deleted`,
          })
          router.push("/");
          return;
        }

        if (data.type === "message-created") {
          console.log("message-created")
        }

        if (data.name) {
          setGroupName(data.name);
        }
        setError(undefined);
        setData(data);
        onData?.(data);
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

  return { dataStream: data, error, isPending };
}
