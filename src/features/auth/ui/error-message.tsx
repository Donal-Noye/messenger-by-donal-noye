import { Alert, AlertDescription } from "@/shared/ui/alert";

export function ErrorMessage({ error }: { error?: string }) {
  if (error) {
    return (
      <Alert className="bg-destructive text-destructive-foreground">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return null;
}
