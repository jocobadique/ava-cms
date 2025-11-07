import type { Metadata } from "next" ;
import localFont from "next/font/local" ;
import "./globals.css" ;
import { cookies } from "next/headers" ;
import AntDesignProviders from "@/providers/ant-design-providers" ;

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
}) ;
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
}) ;

export const metadata: Metadata = {
  title: "AVA CMS",
  description: "Automated Vital Assistant",
} ;

export default async function RootLayout({ children, }: Readonly<{children: React.ReactNode ;}>)
{
  const cookieStore = await cookies() ;
  const themeCookie = await cookieStore.get("theme") ;
  const defaultTheme = themeCookie?.value || "light" ;

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AntDesignProviders defaultTheme={defaultTheme}>
          {children}
        </AntDesignProviders>
      </body>
    </html>
  ) ;
}
