import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import Library from './pages/Library';
import BookDetail from './pages/BookDetail';
import Reader from './pages/Reader';
import Bookmarks from './pages/Bookmarks';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';

function ReaderRoute() {
  const { bookId } = useParams();
  // 以 bookId 作为 key，确保切换不同书籍时阅读器完整重挂载，避免状态串用
  return <Reader key={bookId} />;
}

export default function App() {
  const loc = useLocation();
  const showNav = !loc.pathname.startsWith('/reader');
  return (
    <div className="app-shell">
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/book/:bookId" element={<BookDetail />} />
          <Route path="/reader/:bookId" element={<ReaderRoute />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Library />} />
        </Routes>
      </div>
      {showNav && <BottomNav />}
    </div>
  );
}
