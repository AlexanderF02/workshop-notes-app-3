
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noteByIdQueryOptions, invalidateNotes } from '../utils/notes';
import { updateNote, deleteNote } from '../api/notes';
import { createFileRoute } from '@tanstack/react-router';
import { NoteDetailErrorComponent } from '../components/NoteDetailErrorComponent';

export const Route = createFileRoute('/notes_/$id')({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(noteByIdQueryOptions(Number(params.id)));
  },
  errorComponent: NoteDetailErrorComponent,
  component: NoteDetail, 
});

function NoteDetail() {
  const queryClient = useQueryClient();
  // get id from route params
  const { id } = Route.useParams();
  const navigate = Route.useNavigate();
  const { data: note } = useSuspenseQuery(noteByIdQueryOptions(Number(id)));

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    updateMutation.mutate({ [e.target.name]: e.target.value });
  }

  return (
    <div>
      <h1>Edit Note</h1>
      <input name="title" value={note.title} onChange={handleChange} placeholder="Title" />
      <textarea name="body" value={note.body || ''} onChange={handleChange} placeholder="Body" />
      <button onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>Delete</button>
    </div>
  );
}
