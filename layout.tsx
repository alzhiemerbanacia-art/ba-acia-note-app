import './globals.css';

export const metadata = {
  title: 'Note ni allie - Nostalgia Post',
  description: 'A Next.js Note Application with retro scrapbook design',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
