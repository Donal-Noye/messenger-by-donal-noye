import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { useId } from "react";

export function EmailField({
  formData,
  errors,
}: {
  formData?: FormData;
  errors?: string;
}) {
  const id = useId();

  return (
    <div className="flex flex-col space-y-2 w-full">
      <Label className="text-primary" htmlFor={id}>
        Email
      </Label>
      <Input
        id={id}
        name="email"
        type="email"
        placeholder="Enter your email"
        defaultValue={formData?.get("email")?.toString()}
      />
      {errors && <p className="text-[#6E6E6E]">{errors}</p>}
    </div>
  );
}
