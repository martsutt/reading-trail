import { useState } from 'react';
import { Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import { validateSession } from '../validation.js';

export default function SessionForm({ onAdd, submitting }) {
  const [book, setBook] = useState('');
  const [pages, setPages] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = validateSession({ book, pages });
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const ok = await onAdd({ book: book.trim(), pages: Number(pages) });
    if (ok) {
      setBook('');
      setPages('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'flex-start' }}>
        <TextField
          label="Book"
          value={book}
          onChange={(e) => setBook(e.target.value)}
          error={Boolean(errors.book)}
          helperText={errors.book || `${book.trim().length}/100`}
          fullWidth
        />
        <TextField
          label="Pages"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          error={Boolean(errors.pages)}
          helperText={errors.pages || '1–1000'}
          sx={{ minWidth: { sm: 160 } }}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{ height: 56, whiteSpace: 'nowrap' }}
        >
          Add session
        </Button>
      </Stack>
    </Box>
  );
}