import { searchBooks } from '../src/lib/search';
import { books } from '../src/data/books';

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg);
    process.exit(1);
  }
}

assert(Array.isArray(books) && books.length > 0, 'books loaded');
assert(searchBooks('').length === 0, '空查询返回 []');
assert(searchBooks('   ').length === 0, '纯空格返回 []');

const rAuthor = searchBooks('鲁迅');
assert(rAuthor.length > 0, '按作者“鲁迅”有结果');
assert(rAuthor.every((h) => h.author === '鲁迅'), '作者结果均为鲁迅');

const rTitle = searchBooks('狂人');
assert(rTitle.some((h) => h.bookTitle === '狂人日记'), '按书名“狂人”命中《狂人日记》');

const rBody = searchBooks('吃人');
assert(rBody.length > 0, '按正文“吃人”命中');

const rNone = searchBooks('zzz不存在的词zzz');
assert(rNone.length === 0, '无意义词无结果');

console.log(
  'SEARCH_TEST_OK',
  JSON.stringify({ 鲁迅: rAuthor.length, 狂人: rTitle.length, 吃人: rBody.length })
);
