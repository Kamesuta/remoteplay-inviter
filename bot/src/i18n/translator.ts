import type { Locale, LocalizationMap } from 'discord-api-types/v10';

/** Languages the bot has messages for */
export type Language = 'en' | 'ja';

/** Messages of one language, nested by key */
export interface Dictionary {
  [key: string]: string | Dictionary;
}

/** Values inserted into `{{name}}` placeholders */
export type Replacements = Record<string, string | number>;

/**
 * Pick the language for a Discord locale (English unless Japanese)
 * @param locale Discord locale
 * @returns language of the messages
 */
export function languageOf(locale: string | undefined): Language {
  return locale === 'ja' ? 'ja' : 'en';
}

/**
 * Look up a dotted key such as `invite_command.description`
 * @param dictionary messages of one language
 * @param key dotted key
 * @returns the message, if any
 */
function lookup(dictionary: Dictionary, key: string): string | undefined {
  let node: string | Dictionary | undefined = dictionary;
  for (const part of key.split('.')) {
    if (typeof node !== 'object') return undefined;
    node = node[part];
  }
  return typeof node === 'string' ? node : undefined;
}

/**
 * Messages in every language
 */
export class Translator {
  /**
   * Constructor
   * @param _dictionaries messages of each language
   */
  constructor(private _dictionaries: Record<Language, Dictionary>) {}

  /**
   * Get a message, falling back to English
   * @param locale Discord locale
   * @param key dotted key
   * @param replacements values for `{{name}}` and `{{{name}}}` placeholders
   * @returns the message (the key itself if it is missing)
   */
  t(
    locale: string | undefined,
    key: string,
    replacements: Replacements = {},
  ): string {
    const text =
      lookup(this._dictionaries[languageOf(locale)], key) ??
      lookup(this._dictionaries.en, key) ??
      key;
    return text.replace(
      /\{\{\{?\s*(\w+)\s*\}?\}\}/g,
      (_match, name: string) => `${replacements[name] ?? ''}`,
    );
  }

  /**
   * Localized texts for command definitions
   * @param key dotted key
   * @returns texts keyed by Discord locale
   */
  localizations(key: string): LocalizationMap {
    const en = this.t('en', key);
    return {
      ['en-US' as Locale]: en,
      ['en-GB' as Locale]: en,
      ['ja' as Locale]: this.t('ja', key),
    };
  }
}
