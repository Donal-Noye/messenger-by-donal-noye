import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Loader } from "lucide-react";

export function DeleteButton({
  onConfirm,
  isPending,
}: {
  onConfirm: () => void;
  isPending: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (confirming) {
      onConfirm();
    } else {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
    }
  };

  return (
    <Button
      disabled={isPending}
      variant="destructive"
      size="lg"
      onClick={handleClick}
      className={`w-full transition-transform duration-300 ${
        confirming ? "scale-105" : "scale-100"
      }`}
    >
      {isPending ? (
        <Loader className="animate-spin" />
      ) : confirming ? (
        "Are you sure?"
      ) : (
        "Delete"
      )}
    </Button>
  );
}
