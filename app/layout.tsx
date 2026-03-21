import "./globals.css";
import type { Metadata } from "next";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";

export const metadata: Metadata = {
  title: "VeriTask",
  description: "Human-only microtasks inside World App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MiniKitProvider>{children}</MiniKitProvider>
      </body>
    </html>
  );
}
