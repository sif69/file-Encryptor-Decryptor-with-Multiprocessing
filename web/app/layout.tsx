import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "File Encryptor/Decryptor",
  description: "Encrypt and decrypt files with multiprocessing support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
