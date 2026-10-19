/** Locale files bundled as text (see `rules` in wrangler.toml) */
declare module '*.yml' {
  const content: string;
  export default content;
}
