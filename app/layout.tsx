import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/lib/themes/ThemeProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Perfect Calendar — Every Date Has a Story",
  description:
    "A premium, quiet, and precise Indian calendar web application combining practical month planning with cultural and historical depth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC inline script to set initial theme attribute prior to render */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var app = localStorage.getItem('perfect-calendar-appearance');
                  var theme = 'light';
                  if (app === 'dark' || (!app && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    theme = 'dark';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
