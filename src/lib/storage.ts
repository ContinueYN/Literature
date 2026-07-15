// localStorage 安全封装：命名空间 + JSON + 异常兜底
const PREFIX = 'moyue:';

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* 隐私模式 / 配额满：静默失败，不影响阅读 */
  }
}
