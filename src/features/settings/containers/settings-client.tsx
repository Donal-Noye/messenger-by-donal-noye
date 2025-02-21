"use client";

import { SessionEntity } from "@/entities/user/domain";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { startTransition } from "react";
import { useAccountForm } from "../model/use-account-form";
import { usePasswordForm } from "../model/use-password-form";
import { formSchema, passwordSchema } from "@/features/settings/model/schema";
import { AccountForm } from "@/features/settings/ui/account-form";
import { PasswordForm } from "@/features/settings/ui/password-form";

export function SettingsClient(session: SessionEntity) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: session.name,
      email: session.email,
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { dispatch, isPending } = useAccountForm(session);

  const { dispatchPassword, isPasswordPending } = usePasswordForm(session.id);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      dispatch(values);
    });
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    startTransition(() => {
      dispatchPassword(values);
    });
  }

  return (
    <ScrollArea className="h-full">
      <div className="h-36 w-full bg-[#C6DEE7]"></div>
      <div className="px-8 pb-8">
        <div className="flex items-end gap-6 -mt-[60px] pb-7">
          <Avatar className="w-36 h-36">
            <AvatarImage src={session.avatar} alt="" />
            <AvatarFallback className="text-6xl">
              {session.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="">
            <p className="text-3xl font-medium">{session.name}</p>
            <p className="text-lg text-secondary">{session.email}</p>
          </div>
        </div>
        <Tabs defaultValue="account" className="w-1/2">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="logout">Logout</TabsTrigger>
            <TabsTrigger value="delete">Delete Account</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="mt-7">
            <AccountForm
              form={form}
              isPending={isPending}
              onSubmit={onSubmit}
            />
          </TabsContent>
          <TabsContent value="password" className="mt-7">
            <PasswordForm
              form={passwordForm}
              isPending={isPasswordPending}
              onSubmit={onPasswordSubmit}
            />
          </TabsContent>
          <TabsContent value="logout" className="mt-7">
            <h3 className="text-2xl font-medium text-primary mb-8">Logout</h3>
          </TabsContent>
          <TabsContent value="delete" className="mt-7">
            <h3 className="text-2xl font-medium text-primary mb-8">
              Delete Account
            </h3>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
