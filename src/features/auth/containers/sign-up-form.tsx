"use client";

import { AuthFormLayout } from "@/features/auth/ui/auth-form-layout";
import { EmailField } from "@/features/auth/ui/email-field";
import { PasswordField } from "@/features/auth/ui/password-field";
import { SubmitButton } from "@/features/auth/ui/submit-button";
import { BottomLink } from "@/features/auth/ui/bottom-link";
import { NameField } from "@/features/auth/ui/name-field";
import { ErrorMessage } from "@/features/auth/ui/error-message";
import { signUpAction, SignUpFormState } from "@/features/auth/actions/sign-up";
import { useActionState } from "@/shared/lib/react";
import { routes } from "@/kernel/routes";

export function SignUpForm() {
  const [formState, action, isPending] = useActionState(
    signUpAction,
    {} as SignUpFormState,
  );

  return (
    <AuthFormLayout
      title="Sign Up"
      description="Create your account to get started."
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
      nameField={
        <NameField
          formData={formState.formData}
          errors={formState.errors?.name}
        />
      }
      action={action}
      actions={<SubmitButton isPending={isPending}>Get started</SubmitButton>}
      link={
        <BottomLink
          text="Already have an account?"
          linkText="Sign in"
          url={routes.signIn()}
        />
      }
      error={<ErrorMessage error={formState.errors?._errors} />}
    />
  );
}
