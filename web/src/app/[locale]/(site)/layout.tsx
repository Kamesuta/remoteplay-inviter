import { GoogleAnalytics } from "@/components/GoogleAnalytics";

// Pages people visit. Pages made only for recording (embed) live outside this group and skip analytics
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleAnalytics />
      {children}
    </>
  );
}
