import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noteByIdQueryOptions, invalidateNotes, updateNote, deleteNote } from '../utils/notes';
import { createFileRoute } from '@tanstack/react-router';
import { NoteDetailErrorComponent } from '../components/NoteDetailErrorComponent';
import React from 'react';

export const Route = createFileRoute('/notes_/$id')({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(noteByIdQueryOptions(Number(params.id)));
  },
  errorComponent: NoteDetailErrorComponent,
  component: NoteDetail, 
});

function NoteDetail() {
  const queryClient = useQueryClient();
  const { id } = Route.useParams();
  const navigate = Route.useNavigate();
  const { data: note } = useSuspenseQuery(noteByIdQueryOptions(Number(id)));

  // Lokal state för inputs
  const [title, setTitle] = React.useState(note?.title ?? '');
  const [body, setBody] = React.useState(note?.body ?? '');

  // Synka state när note laddas
  React.useEffect(() => {
    setTitle(note?.title ?? '');
    setBody(note?.body ?? '');
  }, [note]);

  const updateMutation = useMutation({
    mutationFn: (update: any) => updateNote(Number(id), update),
    onSuccess: () => invalidateNotes(queryClient),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteNote(Number(id)),
    onSuccess: () => {
      invalidateNotes(queryClient);
      navigate({ to: '/notes' });
    },
  });

  function handleSave() {
    updateMutation.mutate({ title, body });
  }

  return (
    <div>
      <h1>Edit Note</h1>
      <input
        name="title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        name="body"
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Body"
      />
      <button onClick={handleSave} disabled={updateMutation.isPending}>Spara</button>
      <button onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>Delete</button>
    </div>
  );
}
