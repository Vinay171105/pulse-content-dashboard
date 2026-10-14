import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/store/Providers';
export const metadata: Metadata = { title: 'Pulse — Personalized Dashboard', description: 'Your personalized content, all in one place.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><Providers>{children}</Providers></body></html>; }
