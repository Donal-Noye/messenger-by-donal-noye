"use client";

import { AuthFormLayout } from "@/features/auth/ui/auth-form-layout";
import { EmailField } from "@/features/auth/ui/email-field";
import { PasswordField } from "@/features/auth/ui/password-field";
import { SubmitButton } from "@/features/auth/ui/submit-button";
import { BottomLink } from "@/features/auth/ui/bottom-link";
import { ErrorMessage } from "@/features/auth/ui/error-message";
import { useActionState } from "@/shared/lib/react";
import { signInAction, SignInFormState } from "@/features/auth/actions/sign-in";
import { routes } from "@/kernel/routes";

export function SignInForm() {
  const [formState, action, isPending] = useActionState(
    signInAction,
    {} as SignInFormState,
  );

  return (
    <AuthFormLayout
      title="Sign In"
      description="Welcome back! Please enter your details."
      action={action}
      emailField={
        <EmailField
          formData={formState.formData}
          errors={formState.errors?.email}
        />
      }
      passwordField={
        <PasswordField
          formData={formState.formData}
          errors={formState.errors?.password}
        />
      }
      actions={<SubmitButton isPending={isPending}>Sign In</SubmitButton>}
      link={
        <BottomLink
          text="Don’t have an account?"
          linkText="Sign up"
          url={routes.signUp()}
        />
      }
      error={<ErrorMessage error={formState.errors?._errors} />}
    />
  );
}
