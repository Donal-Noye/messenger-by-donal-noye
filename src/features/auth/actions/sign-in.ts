"use server";

import { z } from "zod";
import { sessionService, verifyUserPassword } from "@/entities/user/server";
import { redirect } from "next/navigation";

export type SignInFormState = {
  formData?: FormData;
  errors?: {
    email?: string;
    password?: string;
    _errors?: string;
  };
};

const formDataSchema = z.object({
  email: z.string().email({ message: "Email address is required" }),
  password: z.string().min(6),
});

export const signInAction = async (
  _: SignInFormState,
  formData: FormData,
): Promise<SignInFormState> => {
  const data = Object.fromEntries(formData.entries());

  const result = formDataSchema.safeParse(data);

  if (!result.success) {
    const formatedErrors = result.error.format();

    return {
      formData,
      errors: {
        email: formatedErrors.email?._errors.join(", "),
        password: formatedErrors.password?._errors.join(", "),
        _errors: formatedErrors._errors.join(", "),
      },
    };
  }

  const verifyUserResult = await verifyUserPassword(result.data);

  if (verifyUserResult.type === "right") {
    await sessionService.addSession(verifyUserResult.value);

    redirect("/");
  }

  const errors = {
    "wrong-email-or-password": "Wrong email or password",
  }[verifyUserResult.error];

  return {
    formData,
    errors: {
      _errors: errors,
    },
  };
};
