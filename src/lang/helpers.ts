import ar from 'lang/locale/ar';
import cz from 'lang/locale/cz';
import da from 'lang/locale/da';
import de from 'lang/locale/de';
import en from 'lang/locale/en';
import es from 'lang/locale/es';
import fr from 'lang/locale/fr';
import hi from 'lang/locale/hi';
import id from 'lang/locale/id';
import it from 'lang/locale/it';
import ja from 'lang/locale/ja';
import ko from 'lang/locale/ko';
import nl from 'lang/locale/nl';
import no from 'lang/locale/no';
import pl from 'lang/locale/pl';
import pt from 'lang/locale/pt';
import ptBR from 'lang/locale/pt-br';
import ro from 'lang/locale/ro';
import ru from 'lang/locale/ru';
import sq from 'lang/locale/sq';
import tr from 'lang/locale/tr';
import uk from 'lang/locale/tr';
import zhCN from 'lang/locale/zh-cn';
import zhTW from 'lang/locale/zh-tw';

import * as Locales from 'date-fns/locale';

import { LOGGER } from 'services/Logger';
import { registerLocale } from 'react-datepicker';

const localeMap: { [k: string]: Partial<typeof en> } = {
  ar,
  cz,
  da,
  de,
  en,
  es,
  fr,
  hi,
  id,
  it,
  ja,
  ko,
  nl,
  no,
  pl,
  'pt-BR': ptBR,
  pt,
  ro,
  ru,
  sq,
  tr,
  uk,
  'zh-TW': zhTW,
  zh: zhCN,
};

export const OBSIDIAN_LOCALE = localStorage.getItem('language');
const locale = localeMap[OBSIDIAN_LOCALE || 'en'];

/**
 * Translate a string to the current language or English if not found.
 * 
 * You can pass in arguments to replace in the string using {0}, {1}, etc.
 * @param str 
 * @param args 
 * @returns 
 */
export function t(str: keyof typeof en, ...args: string[]): string {
  if (!locale) {
    LOGGER.error('Error: database locale not found', OBSIDIAN_LOCALE);
  }
  const translated = (locale && locale[str]) || en[str];

  if (!translated) {
    LOGGER.warn('String key not found in locale', str);
    return str;
  }

  // Replace any arguments in the string
  return args.reduce((acc, arg, i) => acc.replace(`{${i}}`, arg), translated);
}

/**
 * If you trust the string to be in the current language (e.g. variable names) then use this.
 * @param str 
 * @param args 
 * @returns 
 */
export function dynamic_t(str: string, ...args: string[]): string {
  return t(str as keyof typeof en, ...args);
}

/**
 * Looks up a date-fns locale from the Expo localization object.  This falls back to `en-US`
 * @param localization Expo Localization object containing the locale and region.
 * @returns date-fns locale.
 */
export function registerDynamicLocale() {
  const dynamicLocale =
    Locales[OBSIDIAN_LOCALE as keyof typeof Locales] || Locales.enUS;

  registerLocale(OBSIDIAN_LOCALE, dynamicLocale);
}