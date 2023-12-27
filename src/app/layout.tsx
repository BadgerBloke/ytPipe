import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

import ThemeProvider from '~/components/theme-provider';
import { Toaster } from '~/components/ui/sonner';
import { cn } from '~/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const fontHeading = localFont({
    src: '../components/assets/fonts/CalSans-SemiBold.woff',
    variable: '--font-heading',
});

export const metadata: Metadata = {
    title: 'Manage your YouTube resources | ytPipe',
    description: 'Manage your YouTube resources with role based access control.',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="shortcut icon" href="/icon.png" />
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
            </head>
            <body
                className={cn(
                    inter.className,
                    'flex min-h-screen flex-col overflow-x-hidden antialiased',
                    inter.variable,
                    fontHeading.variable
                )}
            >
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <Toaster richColors />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;
