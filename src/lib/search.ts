import { books } from '../data/books';

export interface SearchHit {
  bookId: string;
  bookTitle: string;
  author: string;
  chapterIndex: number; // 第几章（从0开始）
  chapterTitle: string; // 章节名
  snippet: string; // 命中上下文片段
}

// 本地全文书库检索：遍历所有书籍/章节/段落，子串匹配（大小写不敏感已由中文天然满足）
export function searchBooks(query: string): SearchHit[] {
  const q = query.trim();
  if (!q) return [];
  const hits: SearchHit[] = [];
  for (const book of books) {
    // 书名 / 作者 命中
    if (book.title.includes(q) || book.author.includes(q)) {
      hits.push({
        bookId: book.id,
        bookTitle: book.title,
        author: book.author,
        chapterIndex: 0,
        chapterTitle: book.chapters[0]?.title ?? '',
        snippet: '（书名 / 作者命中）' + book.intro
      });
    }
    // 正文命中
    book.chapters.forEach((ch, ci) => {
      for (const para of ch.paragraphs) {
        const idx = para.indexOf(q);
        if (idx >= 0) {
          const start = Math.max(0, idx - 14);
          const end = Math.min(para.length, idx + q.length + 20);
          const snippet =
            (start > 0 ? '…' : '') + para.slice(start, end) + (end < para.length ? '…' : '');
          hits.push({
            bookId: book.id,
            bookTitle: book.title,
            author: book.author,
            chapterIndex: ci,
            chapterTitle: ch.title,
            snippet
          });
          return; // 每章最多一个命中，控制结果规模
        }
      }
    });
  }
  return hits;
}
