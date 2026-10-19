import { parse } from 'yaml';
import enYaml from '../../locales/en.yml';
import jaYaml from '../../locales/ja.yml';
import { Dictionary, Translator } from './translator.js';

/** Messages bundled with the Worker */
export const i18n = new Translator({
  en: parse(enYaml) as Dictionary,
  ja: parse(jaYaml) as Dictionary,
});
