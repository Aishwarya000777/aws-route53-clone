"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "sonner";

export default function AWSLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/login";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (isLogin) {
      setAuthChecked(true);
      return;
    }
    if (!localStorage.getItem("route53_token")) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [isLogin, router]);

  if (isLogin) {
    return (
      <>
        {children}
        <Toaster position="top-right" richColors theme="dark" />
      </>
    );
  }

  if (!authChecked) {
    return <div className="min-h-screen grid place-items-center bg-[#161d26] text-white">Loading Route 53 console...</div>;
  }

  return (
    <div className="aws-app">
      <Header onToggleSidebar={() => setSidebarCollapsed((value) => !value)} />
      <div className="aws-workspace">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="aws-main">
          <div className="aws-content">{children}</div>
        </main>
      </div>
      <Toaster position="top-right" richColors theme="dark" />
    </div>
  );
}



