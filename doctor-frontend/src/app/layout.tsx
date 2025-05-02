// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Apollo Clone",
  description: "Doctor listing page inspired by Apollo247",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
