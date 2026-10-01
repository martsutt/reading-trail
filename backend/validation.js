export function validateItem(body) {
    const book = typeof body?.book === 'string' ? body.book.trim() : '';
    const pages = body?.pages;

    if (book.length < 1 || book.length > 100) {
        return { error: 'book must be 1-100 characters' };
    }

    if (!Number.isInteger(pages) || pages < 1 || pages > 1000) {
        return { error: 'pages must be an integer between 1 and 1000' };
    }

    return { value: { book, pages } };
}