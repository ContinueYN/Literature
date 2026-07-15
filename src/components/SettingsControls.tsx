import type { ReactNode } from 'react';
import { useSettings, type FontSize, type LineHeight, type Theme, type FontFamily, type Width } from '../store/SettingsContext';

const fontSizes: { v: FontSize; label: string }[] = [
  { v: 'sm', label: '小' },
  { v: 'md', label: '中' },
  { v: 'lg', label: '大' },
  { v: 'xl', label: '特大' }
];
const lineHeights: { v: LineHeight; label: string }[] = [
  { v: 'normal', label: '紧凑' },
  { v: 'loose', label: '舒适' },
  { v: 'looser', label: '宽松' }
];
const themes: { v: Theme; label: string }[] = [
  { v: 'day', label: '日间' },
  { v: 'sepia', label: '护眼' },
  { v: 'night', label: '夜间' }
];
const fonts: { v: FontFamily; label: string }[] = [
  { v: 'song', label: '宋体' },
  { v: 'kai', label: '楷体' },
  { v: 'system', label: '系统' }
];
const widths: { v: Width; label: string }[] = [
  { v: 'narrow', label: '窄' },
  { v: 'normal', label: '适中' },
  { v: 'wide', label: '宽' }
];

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="setting-group">
      <div className="setting-group-title">{title}</div>
      <div className="setting-options">{children}</div>
    </div>
  );
}

export default function SettingsControls() {
  const { settings, update } = useSettings();
  return (
    <div className="settings-controls">
      <Group title="主题">
        {themes.map((t) => (
          <button
            key={t.v}
            className={'seg' + (settings.theme === t.v ? ' on' : '')}
            onClick={() => update({ theme: t.v })}
          >
            {t.label}
          </button>
        ))}
      </Group>

      <Group title="字号">
        {fontSizes.map((t) => (
          <button
            key={t.v}
            className={'seg' + (settings.fontSize === t.v ? ' on' : '')}
            onClick={() => update({ fontSize: t.v })}
          >
            {t.label}
          </button>
        ))}
      </Group>

      <Group title="行距">
        {lineHeights.map((t) => (
          <button
            key={t.v}
            className={'seg' + (settings.lineHeight === t.v ? ' on' : '')}
            onClick={() => update({ lineHeight: t.v })}
          >
            {t.label}
          </button>
        ))}
      </Group>

      <Group title="正文字体">
        {fonts.map((t) => (
          <button
            key={t.v}
            className={'seg' + (settings.fontFamily === t.v ? ' on' : '')}
            onClick={() => update({ fontFamily: t.v })}
          >
            {t.label}
          </button>
        ))}
      </Group>

      <Group title="阅读宽度">
        {widths.map((t) => (
          <button
            key={t.v}
            className={'seg' + (settings.width === t.v ? ' on' : '')}
            onClick={() => update({ width: t.v })}
          >
            {t.label}
          </button>
        ))}
      </Group>
    </div>
  );
}
