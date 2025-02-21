import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export function AuthFormLayout({
  title,
  nameField,
  emailField,
  passwordField,
  actions,
  description,
  link,
  error,
  action
}: {
  title: string;
  description: string;
  nameField?: React.ReactNode;
  emailField: React.ReactNode;
  passwordField: React.ReactNode;
  actions: React.ReactNode;
  link: React.ReactNode;
  error: React.ReactNode;
  action: (formData: FormData) => void;
}) {
  return (
    <Card className="w-96 border-none">
      <CardHeader className="mb-4">
        <CardTitle className="text-4xl font-medium text-center text-primary mb-2">
          {title}
        </CardTitle>
        <CardDescription className="text-center text-base">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="flex flex-col w-full items-center gap-4">
            {nameField}
            {emailField}
            {passwordField}
          </div>
          {error}
          {actions}
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-3 px-0">
        {link}
      </CardFooter>
    </Card>
  );
}
