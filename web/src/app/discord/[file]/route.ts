import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { buildHomeComponentEmbed } from "@/utils/discordEmbed";

// /discord/home-en.json and /discord/home-ja.json.
// The dot in the name keeps them out of the locale middleware.
export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ file: `home-${locale}.json` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const locale = /^home-(\w+)\.json$/.exec(file)?.[1];
  // Other names get a 404 here: `dynamicParams = false` would 404 every name on Workers,
  // which has no store for the prerendered responses
  if (!hasLocale(routing.locales, locale)) {
    return new Response("Not Found", { status: 404 });
  }
  return Response.json(await buildHomeComponentEmbed(locale));
}
