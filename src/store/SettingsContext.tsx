import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { load, save } from '../lib/storage';

export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
export type LineHeight = 'normal' | 'loose' | 'looser';
export type Theme = 'day' | 'night' | 'sepia';
export type FontFamily = 'system' | 'song' | 'kai';
export type Width = 'narrow' | 'normal' | 'wide';

export interface Settings {
  fontSize: FontSize;
  lineHeight: LineHeight;
  theme: Theme;
  fontFamily: FontFamily;
  width: Width;
}

const DEFAULT: Settings = {
  fontSize: 'md',
  lineHeight: 'loose',
  theme: 'day',
  fontFamily: 'song',
  width: 'normal'
};

interface State {
  settings: Settings;
}
type Action = { type: 'update'; patch: Partial<Settings> } | { type: 'reset' };

function reducer(s: State, a: Action): State {
  if (a.type === 'reset') {
    save('settings', DEFAULT);
    return { settings: DEFAULT };
  }
  const settings = { ...s.settings, ...a.patch };
  save('settings', settings);
  return { settings };
}

interface Ctx {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  reset: () => void;
}
const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const stored = load<Partial<Settings>>('settings', {});
  const initialSettings: Settings = { ...DEFAULT, ...stored };
  const [state, dispatch] = useReducer(reducer, { settings: initialSettings });

  useEffect(() => {
    const d = document.documentElement;
    d.dataset.theme = state.settings.theme;
    d.dataset.fontsize = state.settings.fontSize;
    d.dataset.lh = state.settings.lineHeight;
    d.dataset.ff = state.settings.fontFamily;
    d.dataset.width = state.settings.width;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', state.settings.theme === 'night' ? '#16171a' : '#1f1b16');
    }
  }, [state.settings]);

  const value: Ctx = {
    settings: state.settings,
    update: (patch) => dispatch({ type: 'update', patch }),
    reset: () => dispatch({ type: 'reset' })
  };
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): Ctx {
  const c = useContext(SettingsContext);
  if (!c) throw new Error('useSettings 必须在 SettingsProvider 内使用');
  return c;
}
