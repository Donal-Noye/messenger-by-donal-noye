import { ReactNode } from "react";
import {sessionService} from "@/entities/user/server";
import {redirect} from "next/navigation";
import {routes} from "@/kernel/routes";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  let session;
  try {
    session = await sessionService.verifySession();
  } catch {
    session = { isAuth: false };
  }

  if (session.isAuth) {
    return redirect(routes.home());
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {children}
    </div>
  );
}
