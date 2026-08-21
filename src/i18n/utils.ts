import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}
export { useMetaTranslations } from './ui';
export { useHeroTranslations } from './ui';
export { useCalcTranslations } from './ui';
export { useFeaturesTranslations } from './ui';
export { useFooterTranslations } from './ui';
export { useStepsTranslations } from './ui';
export { useProTranslations } from './ui';

export function useWaitlistTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}
