import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'HR Hiring System - Professional Recruitment Management',
  description: 'Complete end-to-end hiring system with candidate management, interview tracking, offer management, and onboarding checklists',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/myicon.png',  // Updated apple icon
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon for browser tab */}
        <link rel="icon" href="/myicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/myicon.png" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
