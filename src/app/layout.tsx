"use client";

import "./globals.scss";
import type { Metadata } from "next";
import { store } from "@/redux/store";
import { Provider } from "react-redux";

// export const metadata: Metadata = {
//   title: "Hesabat",
//   description: "."
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <html lang="en">
        <head>
          <title>Hesabat</title>
        </head>
        <body>
          {children}
        </body>
      </html>
    </Provider>
  );
}
