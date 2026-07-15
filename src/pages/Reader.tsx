import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { books } from '../data/books';
import { useLibrary } from '../store/LibraryContext';
import SettingsControls from '../components/SettingsControls';
import ChapterDrawer from '../components/ChapterDrawer';

export default function Reader() {
  const { bookId } = useParams();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { addBookmark, setProgress, getProgress } = useLibrary();

  const book = books.find((b) => b.id === bookId);
  const progress = book ? getProgress(book.id) : undefined;

  const chParam = params.get('ch');
  const rawCh = chParam ? parseInt(chParam, 10) : NaN;
  const clampedCh = book
    ? Math.min(Math.max(0, Number.isNaN(rawCh) ? 0 : rawCh), book.chapters.length - 1)
    : 0;
  const startChapter = Number.isNaN(rawCh) ? (progress ? progress.chapterIndex : 0) : clampedCh;
  const startRatio = progress && startChapter === progress.chapterIndex ? progress.ratio : 0;

  const [chapterIndex, setChapterIndex] = useState(startChapter);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const restored = useRef<{ ch: number; ratio: number }>({ ch: startChapter, ratio: startRatio });
  const lastSave = useRef(0);

  // 切章时定位滚动位置（首次进入按续读比例恢复，其余回到顶部）
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      if (restored.current.ch === chapterIndex) {
        const max = el.scrollHeight - el.clientHeight;
        el.scrollTop = restored.current.ratio * max;
        restored.current = { ch: -1, ratio: 0 };
      } else {
        el.scrollTop = 0;
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [chapterIndex]);

  // toast 自动消失
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 1500);
    return () => clearTimeout(t);
  }, [toast]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el || !book) return;
    const max = el.scrollHeight - el.clientHeight;
    const ratio = max > 0 ? el.scrollTop / max : 0;
    const now = Date.now();
    if (now - lastSave.current > 400) {
      lastSave.current = now;
      setProgress({ bookId: book.id, chapterIndex, ratio });
    }
  }

  function handleAddBookmark() {
    if (!book) return;
    const ch = book.chapters[chapterIndex];
    const first = (ch.paragraphs.find((p) => p.trim()) || '').slice(0, 40);
    const snippet = first + (first.length >= 40 ? '…' : '');
    addBookmark({ bookId: book.id, chapterIndex, snippet: snippet || ch.title });
    setToast('已添加书签');
  }

  if (!book) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => nav('/')}>
          ← 返回
        </button>
        <div className="empty">未找到该作品</div>
      </div>
    );
  }

  const chapter = book.chapters[chapterIndex];
  const isFirst = chapterIndex === 0;
  const isLast = chapterIndex === book.chapters.length - 1;
  const isPoem = book.genre === '诗歌';

  return (
    <div className="reader">
      <header className="reader-bar">
        <button className="icon-btn" onClick={() => nav(-1)} aria-label="返回">
          ←
        </button>
        <div className="reader-bar-title">
          《{book.title}》 · {chapter.title}
        </div>
        <div className="reader-bar-actions">
          <button className="icon-btn" onClick={() => setDrawerOpen(true)} aria-label="目录">
            ☰
          </button>
          <button className="icon-btn" onClick={() => setShowSettings((s) => !s)} aria-label="设置">
            Aa
          </button>
          <button className="icon-btn" onClick={handleAddBookmark} aria-label="书签">
            ＋🔖
          </button>
        </div>
      </header>

      <div className="reader-scroll" ref={scrollRef} onScroll={handleScroll}>
        <article className="reader-text" data-poem={isPoem}>
          <h1 className="reader-chapter-title">{chapter.title}</h1>
          {chapter.paragraphs.map((p, i) => (
            <p key={i} className="reader-paragraph">
              {p}
            </p>
          ))}
        </article>
        <div className="reader-end">—— 本章结束 ——</div>
      </div>

      <footer className="reader-nav">
        <button
          className="reader-nav-btn"
          disabled={isFirst}
          onClick={() => setChapterIndex((i) => Math.max(0, i - 1))}
        >
          ← 上一章
        </button>
        <span className="reader-nav-progress">
          {chapterIndex + 1} / {book.chapters.length}
        </span>
        <button
          className="reader-nav-btn"
          disabled={isLast}
          onClick={() => setChapterIndex((i) => Math.min(book.chapters.length - 1, i + 1))}
        >
          下一章 →
        </button>
      </footer>

      {showSettings && (
        <div className="reader-settings">
          <div className="reader-settings-head">
            <span>阅读设置</span>
            <button className="drawer-close" onClick={() => setShowSettings(false)} aria-label="关闭">
              ✕
            </button>
          </div>
          <SettingsControls />
        </div>
      )}

      <ChapterDrawer
        open={drawerOpen}
        chapters={book.chapters}
        currentIndex={chapterIndex}
        onSelect={(i) => setChapterIndex(i)}
        onClose={() => setDrawerOpen(false)}
      />

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
