
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import AWSLayout from "@/components/AWSLayout";

export const metadata: Metadata = {
  title: "Route 53 | AWS Management Console",
  description: "AWS Route 53 Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              Loading AWS Console...
            </div>
          }
        >
          <AWSLayout>{children}</AWSLayout>
        </Suspense>
      </body>
    </html>
  );
}

