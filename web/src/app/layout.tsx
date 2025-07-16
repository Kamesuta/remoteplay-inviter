// The pages are now served under app/[locale] (e.g. /en or /ja) so this layout is no longer used
// LocaleLayout handles the html/body structure
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}