import type { Chapter } from '../data/books';

interface Props {
  open: boolean;
  chapters: Chapter[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export default function ChapterDrawer({ open, chapters, currentIndex, onSelect, onClose }: Props) {
  return (
    <>
      <div className={'drawer-mask' + (open ? ' show' : '')} onClick={onClose} aria-hidden />
      <aside className={'chapter-drawer' + (open ? ' open' : '')} aria-hidden={!open}>
        <div className="drawer-head">
          <span>目录</span>
          <button className="drawer-close" onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </div>
        <div className="drawer-list">
          {chapters.map((c, i) => (
            <button
              key={c.id}
              className={'drawer-item' + (i === currentIndex ? ' active' : '')}
              onClick={() => {
                onSelect(i);
                onClose();
              }}
            >
              <span className="drawer-index">{i + 1}</span>
              <span className="drawer-title">{c.title}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
