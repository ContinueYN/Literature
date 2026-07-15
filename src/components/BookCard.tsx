import { useNavigate } from 'react-router-dom';
import type { Book } from '../data/books';

export default function BookCard({ book }: { book: Book }) {
  const nav = useNavigate();
  return (
    <button className="book-card" onClick={() => nav(`/book/${book.id}`)}>
      <div className="book-card-spine" aria-hidden />
      <div className="book-card-body">
        <div className="book-card-title">《{book.title}》</div>
        <div className="book-card-meta">
          <span className="tag">{book.genre}</span>
          <span className="book-card-author">{book.author}</span>
          {book.year && <span className="book-card-year">{book.year}</span>}
        </div>
        <div className="book-card-intro">{book.intro}</div>
      </div>
    </button>
  );
}
