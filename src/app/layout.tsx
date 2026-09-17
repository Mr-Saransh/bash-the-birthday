import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Birthdayverse — Make their birthday impossible to forget",
  description:
    "Create a stunning, personalized birthday experience in under 60 seconds. Send a link. Blow their mind.",
  keywords: ["birthday", "surprise", "personalized", "interactive", "experience"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Birthdayverse — Make their birthday impossible to forget",
    description:
      "Create a stunning, personalized birthday experience in under 60 seconds.",
    type: "website",
    siteName: "Birthdayverse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Birthdayverse",
    description:
      "Create a stunning, personalized birthday experience in under 60 seconds.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Ambient glow — always present */}
        <div className="ambient-glow" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
