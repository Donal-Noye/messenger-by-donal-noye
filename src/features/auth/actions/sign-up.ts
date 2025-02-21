"use server";

import { z } from "zod";
import { createUser, sessionService } from "@/entities/user/server";
import { redirect } from "next/navigation";
import {routes} from "@/kernel/routes";

export type SignUpFormState = {
  formData?: FormData;
  errors?: {
    email?: string;
    name?: string;
    password?: string;
    _errors?: string;
  };
};

const formDataSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpAction = async (
  _: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> => {
  const data = Object.fromEntries(formData.entries());

  const result = formDataSchema.safeParse(data);

  if (!result.success) {
    const formatedErrors = result.error.format();

    return {
      formData,
      errors: {
        email: formatedErrors.email?._errors.join(", "),
        name: formatedErrors.name?._errors.join(", "),
        password: formatedErrors.password?._errors.join(", "),
        _errors: formatedErrors._errors.join(", "),
      },
    };
  }

  const createUserResult = await createUser(result.data);

  if (createUserResult.type === "right") {
    await sessionService.addSession(createUserResult.value);

    redirect(routes.home());
  }

  const errors = {
    "user-email-exists": "Пользователь с таким email существует",
  }[createUserResult.error];

  return {
    formData,
    errors: {
      _errors: errors,
    },
  };
};
