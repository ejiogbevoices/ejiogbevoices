import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter, Lora } from "next/font/google"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import Providers from "./providers"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const lora = Lora({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "Ejiogbe Voices - Preserving Indigenous Knowledge",
  description:
    "Preserving and sharing indigenous knowledge through audio recordings, transcriptions, and translations.",
  generator: "v0.app",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${lora.variable} font-sans antialiased`}>
        <Providers>
          <MainNav />
          <main className="min-h-screen pb-20 md:pb-0">{children}</main>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  )
}
