import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

export function PasswordField({
  formData,
  errors,
}: {
  formData?: FormData;
  errors?: string;
}) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col space-y-2 w-full">
      <Label className="text-primary" htmlFor={id}>
        Password
      </Label>
      <div className="relative">
        <Input
          id={id}
          name="password"
          placeholder="Create a password"
          type={showPassword ? "text" : "password"}
          defaultValue={formData?.get("password")?.toString()}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      {errors && <p className="text-[#6E6E6E]">{errors}</p>}
    </div>
  );
}
