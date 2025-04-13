"use client";

import { SessionEntity } from "@/entities/user/domain";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {startTransition, useCallback} from "react";
import { useAccountForm } from "../model/use-account-form";
import { usePasswordForm } from "../model/use-password-form";
import { formSchema, passwordSchema } from "@/features/settings/model/schema";
import { AccountForm } from "@/features/settings/containers/account-form";
import { PasswordForm } from "@/features/settings/containers/password-form";

export function SettingsClient(session: SessionEntity) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: session.name,
      email: session.email,
      phone: session.phone ?? "",
      status: session.status ?? ""
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

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      startTransition(() => {
        dispatch(values);
      });
    },
    [dispatch]
  );

  const onPasswordSubmit = useCallback(
    (values: z.infer<typeof passwordSchema>) => {
      startTransition(() => {
        dispatchPassword(values);
      });
    },
    [dispatchPassword]
  );

  return (
    <ScrollArea className="h-full pb-20 sm:pb-0">
      <div className="h-24 sm:h-36 w-full bg-[#C6DEE7]"></div>
      <div className="px-5 sm:px-8 pb-8">
        <div className="flex items-end gap-6 -mt-[40px] sm:-mt-[60px] pb-7">
          <Avatar className="w-28 h-28 sm:w-36 sm:h-36">
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
        <Tabs defaultValue="account" className="lg:w-1/2">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
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
        </Tabs>
      </div>
    </ScrollArea>
  );
}
