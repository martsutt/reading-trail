export function validateSession({ book, pages }) {
  const errors = {};

  const title = book.trim();
  if (title.length < 1 || title.length > 100) {
    errors.book = 'Book must be 1–100 characters.';
  }

  const p = String(pages).trim();
  if (!/^\d+$/.test(p) || Number(p) < 1 || Number(p) > 1000) {
    errors.pages = 'Pages must be a whole number from 1 to 1000.';
  }

  return errors;
}