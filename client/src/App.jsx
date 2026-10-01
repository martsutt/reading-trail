import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import SessionForm from "./components/SessionForm.jsx";
import SessionList from "./components/SessionList.jsx";
import { addSession, deleteSession, getSessions } from "./api.js";
import { ensureGuestSession } from "./utils/supabase.js";

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      try {
        await ensureGuestSession();
        const items = await getSessions();
        setSessions(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const totalPages = useMemo(
    () => sessions.reduce((sum, s) => sum + Number(s.pages), 0),
    [sessions],
  );

  const handleAdd = async (session) => {
    setError("");
    setSubmitting(true);
    try {
      const created = await addSession(session);
      setSessions((prev) => [...prev, created]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setDeletingId(id);
    try {
      await deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Reading Trail
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Paper variant="outlined" sx={{ p: 3 }}>
          <SessionForm onAdd={handleAdd} submitting={submitting} />
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "baseline" }}
          >
            <Typography variant="h6" component="h2">
              Sessions
            </Typography>
            <Typography color="text.secondary">
              Total pages read: {totalPages}
            </Typography>
          </Stack>
          <Divider sx={{ my: 1 }} />
          <SessionList
            sessions={sessions}
            loading={loading}
            deletingId={deletingId}
            onDelete={handleDelete}
          />
        </Paper>
      </Stack>
    </Container>
  );
}
