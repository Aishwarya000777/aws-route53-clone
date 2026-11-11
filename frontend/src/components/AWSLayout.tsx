
"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "sonner";

export default function AWSLayout({
  children
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isLogin = pathname === "/login";

  useEffect(() => {
    if (!isLogin && !localStorage.getItem("route53_token")) {
      router.replace("/login");
    }
  }, [isLogin, router]);

  if (isLogin) {
    return (
      <>
        {children}
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <div className="aws-app">
      <Sidebar />

      <div className="aws-main">
        <Header />
        <main className="aws-content">
          {children}
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}
