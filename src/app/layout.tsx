import type { Metadata } from 'next';
import { Fredoka } from 'next/font/google';
import './globals.css';

const fredoka = Fredoka({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Safari Guide Quiz - how many can you get?',
  description:
    'This is to help folks test their knowledge of the South African animals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`page ${fredoka.className}`}>{children}</body>
    </html>
  );
}
