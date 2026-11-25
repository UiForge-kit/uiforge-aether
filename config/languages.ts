// the choice is stored but nothing is translated, the template has no i18n layer. ids follow BCP 47
export interface LanguageOption {
  id: string;
  label: string;
  region: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { id: "en-US", label: "English", region: "United States", flag: "🇺🇸" },
  { id: "fr-FR", label: "Français", region: "France", flag: "🇫🇷" },
  { id: "de-DE", label: "Deutsch", region: "Deutschland", flag: "🇩🇪" },
  { id: "zh-CN", label: "中文", region: "简体 · 中国", flag: "🇨🇳" },
  { id: "wo-SN", label: "Wolof", region: "Senegaal", flag: "🇸🇳" },
  { id: "ln-CD", label: "Lingála", region: "Congo", flag: "🇨🇩" },
  { id: "ar-SA", label: "العربية", region: "السعودية", flag: "🇸🇦" },
  { id: "es-ES", label: "Español", region: "España", flag: "🇪🇸" },
];

export function getLanguage(id: string): LanguageOption {
  return LANGUAGES.find((language) => language.id === id) ?? LANGUAGES[1];
}
