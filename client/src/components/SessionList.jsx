import { Button, CircularProgress, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

export default function SessionList({ sessions, loading, deletingId, onDelete }) {
  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 4 }}>
        <CircularProgress aria-label="Loading sessions" />
      </Stack>
    );
  }

  if (sessions.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 3 }}>
        No sessions yet. Add the book you are reading and how many pages you read.
      </Typography>
    );
  }

  return (
    <List disablePadding>
      {sessions.map((s) => (
        <ListItem
          key={s.id}
          divider
          secondaryAction={
            <Button
              color="error"
              size="small"
              disabled={deletingId === s.id}
              onClick={() => onDelete(s.id)}
            >
              {deletingId === s.id ? 'Deleting...' : 'Delete'}
            </Button>
          }
        >
          <ListItemText primary={s.book} secondary={`${s.pages} pages`} />
        </ListItem>
      ))}
    </List>
  );
}