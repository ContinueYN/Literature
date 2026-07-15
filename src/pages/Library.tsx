import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { books, type Genre } from '../data/books';
import { searchBooks, type SearchHit } from '../lib/search';
import BookCard from '../components/BookCard';

const genres: ('全部' | Genre)[] = ['全部', '小说', '散文', '诗歌', '戏剧'];

function SearchResultItem({ hit }: { hit: SearchHit }) {
  const nav = useNavigate();
  return (
    <button
      className="search-result"
      onClick={() => nav(`/reader/${hit.bookId}?ch=${hit.chapterIndex}`)}
    >
      <div className="search-result-head">
        《{hit.bookTitle}》 · {hit.author} · {hit.chapterTitle}
      </div>
      <div className="search-result-snippet">{hit.snippet}</div>
    </button>
  );
}

export default function Library() {
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState<'全部' | Genre>('全部');

  const results = useMemo(() => (q.trim() ? searchBooks(q) : []), [q]);
  const filtered = useMemo(
    () => books.filter((b) => genre === '全部' || b.genre === genre),
    [genre]
  );

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="app-name">墨阅</h1>
        <p className="app-sub">现代文学 · 离线阅读</p>
      </header>

      <div className="search-box">
        <span className="search-icon" aria-hidden>
          🔍
        </span>
        <input
          className="search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索书名、作者或正文…"
          inputMode="search"
        />
        {q && (
          <button className="search-clear" onClick={() => setQ('')} aria-label="清除">
            ✕
          </button>
        )}
      </div>

      {!q && (
        <div className="genre-tabs">
          {genres.map((g) => (
            <button
              key={g}
              className={'genre-tab' + (genre === g ? ' on' : '')}
              onClick={() => setGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {q ? (
        <div className="search-results">
          <div className="result-count">找到 {results.length} 处匹配</div>
          {results.length === 0 && <div className="empty">没有匹配的内容</div>}
          {results.map((h, i) => (
            <SearchResultItem key={i} hit={h} />
          ))}
        </div>
      ) : (
        <div className="book-grid">
          {filtered.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}
