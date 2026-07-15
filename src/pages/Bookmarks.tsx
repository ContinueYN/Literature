import { useNavigate } from 'react-router-dom';
import { books } from '../data/books';
import { useLibrary } from '../store/LibraryContext';

export default function Bookmarks() {
  const nav = useNavigate();
  const { bookmarks, removeBookmark } = useLibrary();

  const withMeta = bookmarks
    .map((b) => {
      const book = books.find((x) => x.id === b.bookId);
      const chapterTitle = book?.chapters[b.chapterIndex]?.title ?? '';
      return { ...b, bookTitle: book?.title ?? '未知', author: book?.author ?? '', chapterTitle };
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="app-name small">我的书签</h1>
      </header>

      {withMeta.length === 0 ? (
        <div className="empty">还没有书签。在阅读页点击右上角「＋🔖」即可收藏精彩段落。</div>
      ) : (
        <div className="bookmark-list">
          {withMeta.map((b) => (
            <div key={b.id} className="bookmark-item">
              <button
                className="bookmark-main"
                onClick={() => nav(`/reader/${b.bookId}?ch=${b.chapterIndex}`)}
              >
                <div className="bookmark-head">
                  《{b.bookTitle}》 · {b.chapterTitle}
                </div>
                <div className="bookmark-snippet">“{b.snippet}”</div>
              </button>
              <button
                className="bookmark-del"
                onClick={() => removeBookmark(b.id)}
                aria-label="删除书签"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
