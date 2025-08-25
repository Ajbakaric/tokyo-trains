// src/lib/i18n.js
export const LANGS = ["en","ja"];
export function t(lang, en, ja){ return lang === "ja" ? ja : en; }
