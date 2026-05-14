import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";
import { Navbar, NavbarCenter, NavbarEnd, NavbarStart } from "@/components/ui/navbar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GitBranch, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeController from "@/components/ThemeController";
import { version } from "../../package.json"

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Paragraphenreiter",
    template: "%s · Paragraphenreiter",
  },
  description:
    "Paragraphenreiter aggregates and curates stories from international news RSS feeds.",
  applicationName: "Paragraphenreiter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(merriweather.className, "h-full antialiased")}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b border-base-content/5 bg-base-300/85 px-4 shadow-sm backdrop-blur-md backdrop-saturate-150">
          <Navbar className="container mx-auto">
            <NavbarStart asChild>
              <b>
                <Link href="/" className="text-base-content">
                  Paragraphenreiter
                </Link>
              </b>
            </NavbarStart>
            <NavbarCenter />
            <NavbarEnd>
              <Button buttonStyle="ghost" modifier="circle" asChild>
                <Link title={`v${version}`} href="https://github.com/janwalenda/paragraphenreiter/releases">
                  <GitBranch className="size-4" />
                </Link>
              </Button>
              <ThemeController />
              <Button buttonStyle="ghost" modifier="circle" asChild>
                <Link href="/feed.rss">
                  <Rss className="size-4" />
                </Link>
              </Button>
            </NavbarEnd>
          </Navbar>
        </header>
        <main className="flex-1 py-4">{children}</main>
      </body>
    </html>
  );
}
