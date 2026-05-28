import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import "./globals.css";
import Providers from "./providers";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap'
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Global Insights Dashboard",
  description: "Interactive analytics dashboard for global insight signals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-[url('/noise.png')]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
