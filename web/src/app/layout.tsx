import type { Metadata } from "next";
import { generateMetadata as createMetadata } from "@/utils/metadata";

// Generate metadata for root path (/) using English messages
export async function generateMetadata(): Promise<Metadata> {
  // Load English messages for root path
  const messages = await import("../../messages/en.json").then(m => m.default);
  return createMetadata({
    title: messages.title,
    description: messages.description,
  });
}

// The pages are now served under app/[locale] (e.g. /en or /ja) so this layout is no longer used
// LocaleLayout handles the html/body structure
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}