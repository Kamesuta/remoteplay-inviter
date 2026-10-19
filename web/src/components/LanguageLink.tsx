"use client";
import type { CSSProperties } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

// Opens the same page in the other language, labelled in that language
export default function LanguageLink({ style }: { style?: CSSProperties }) {
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "ja" ? "en" : "ja";
  return (
    <Link href={pathname} locale={other} hrefLang={other} style={style}>
      {other === "en" ? "English" : "日本語"}
    </Link>
  );
}
