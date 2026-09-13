import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Receipt, TrendingUp, Upload } from 'lucide-react';
import './globals.css';

// Design system type scale: Inter for body/data, Plus Jakarta Sans for
// headings, brand moments, and currency totals (DESIGN.md > Typography).
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BillWise',
  description: 'Understand your electricity bill, in plain language.',
};

const navItems = [
  { href: '/bills', label: 'Bills', icon: Receipt },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/bills/trends', label: 'Trends', icon: TrendingUp },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        <div className="pb-20">{children}</div>
        <nav className="fixed inset-x-0 bottom-0 border-t border-border bg-surface">
          <div className="mx-auto flex max-w-2xl items-center justify-around py-space-xs">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-0.5 px-space-sm py-space-xs text-body-sm text-ink-muted hover:text-primary"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </body>
    </html>
  );
}
