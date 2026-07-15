import { useNavigate, useParams } from 'react-router-dom';
import { books } from '../data/books';
import { useLibrary } from '../store/LibraryContext';

export default function BookDetail() {
  const { bookId } = useParams();
  const nav = useNavigate();
  const { getProgress } = useLibrary();
  const book = books.find((b) => b.id === bookId);

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

  const progress = getProgress(book.id);

  return (
    <div className="page">
      <button className="back-btn" onClick={() => nav(-1)}>
        ← 返回
      </button>

      <header className="detail-head">
        <h1 className="detail-title">《{book.title}》</h1>
        <div className="detail-meta">
          <span className="tag">{book.genre}</span>
          <span>{book.author}</span>
          {book.year && <span>{book.year}</span>}
        </div>
        <p className="detail-intro">{book.intro}</p>
        <button
          className="primary-btn"
          onClick={() => nav(`/reader/${book.id}?ch=${progress ? progress.chapterIndex : 0}`)}
        >
          {progress ? '继续阅读' : '开始阅读'}
        </button>
      </header>

      <h2 className="detail-chapter-title">目录</h2>
      <div className="chapter-list">
        {book.chapters.map((c, i) => (
          <button key={c.id} className="chapter-row" onClick={() => nav(`/reader/${book.id}?ch=${i}`)}>
            <span className="chapter-row-index">{i + 1}</span>
            <span className="chapter-row-title">{c.title}</span>
            <span className="chapter-row-arrow" aria-hidden>
              ›
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
