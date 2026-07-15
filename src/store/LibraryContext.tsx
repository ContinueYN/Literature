import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { load, save } from '../lib/storage';

export interface Bookmark {
  id: string;
  bookId: string;
  chapterIndex: number;
  snippet: string;
  createdAt: number;
}

export interface ReadingProgress {
  bookId: string;
  chapterIndex: number;
  ratio: number; // 0~1 滚动比例
  updatedAt: number;
}

interface State {
  bookmarks: Bookmark[];
  progress: Record<string, ReadingProgress>;
}

type Action =
  | { type: 'addBookmark'; b: Bookmark }
  | { type: 'removeBookmark'; id: string }
  | { type: 'setProgress'; p: ReadingProgress };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'addBookmark': {
      const bookmarks = [a.b, ...s.bookmarks.filter((x) => x.id !== a.b.id)];
      save('bookmarks', bookmarks);
      return { ...s, bookmarks };
    }
    case 'removeBookmark': {
      const bookmarks = s.bookmarks.filter((x) => x.id !== a.id);
      save('bookmarks', bookmarks);
      return { ...s, bookmarks };
    }
    case 'setProgress': {
      const progress = { ...s.progress, [a.p.bookId]: a.p };
      save('progress', progress);
      return { ...s, progress };
    }
  }
}

interface Ctx {
  bookmarks: Bookmark[];
  progress: Record<string, ReadingProgress>;
  addBookmark: (b: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  setProgress: (p: Omit<ReadingProgress, 'updatedAt'>) => void;
  getProgress: (bookId: string) => ReadingProgress | undefined;
}

const LibraryContext = createContext<Ctx | null>(null);

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    bookmarks: load('bookmarks', [] as Bookmark[]),
    progress: load('progress', {} as Record<string, ReadingProgress>)
  });

  const value: Ctx = {
    bookmarks: state.bookmarks,
    progress: state.progress,
    addBookmark: (b) => dispatch({ type: 'addBookmark', b: { ...b, id: uid(), createdAt: Date.now() } }),
    removeBookmark: (id) => dispatch({ type: 'removeBookmark', id }),
    setProgress: (p) => dispatch({ type: 'setProgress', p: { ...p, updatedAt: Date.now() } }),
    getProgress: (bookId) => state.progress[bookId]
  };
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): Ctx {
  const c = useContext(LibraryContext);
  if (!c) throw new Error('useLibrary 必须在 LibraryProvider 内使用');
  return c;
}
