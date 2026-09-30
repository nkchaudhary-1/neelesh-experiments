import { DEFAULT_THEME, THEME_COLORS, THEME_STORAGE_KEY } from '@/lib/theme/theme'

/**
 * Inline script that runs while the HTML is still being parsed, so the first paint is
 * already in the right theme. It mirrors resolveTheme() in theme.ts (the tests run both
 * against the same cases) and must stay dependency-free.
 */
export function themeInitScript(followSystem: boolean): string {
  return `(function(){var t=null;try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(s==="dark"||s==="light")t=s}catch(e){}if(!t&&${followSystem}){try{if(window.matchMedia("(prefers-color-scheme: light)").matches)t="light"}catch(e){}}t=t||${JSON.stringify(DEFAULT_THEME)};var r=document.documentElement;r.setAttribute("data-theme",t);r.style.colorScheme=t;var c=${JSON.stringify(THEME_COLORS)};var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",c[t])})()`
}
