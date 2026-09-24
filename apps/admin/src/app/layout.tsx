import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OKURMEN Admin',
  description: 'Admin panel для управления OKURMEN IT',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
