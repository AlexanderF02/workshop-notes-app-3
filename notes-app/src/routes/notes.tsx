
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesListQueryOptions, invalidateNotes } from '../utils/notes';
import { addNote } from '../utils/notes'; // <-- Denna rad ska vara här!
import { Link, createFileRoute } from '@tanstack/react-router';
import { NotesErrorComponent } from '../components/NotesErrorComponent';

export const Route = createFileRoute('/notes')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(notesListQueryOptions());
  },
  errorComponent: NotesErrorComponent,
  component: NotesList,
});

function NotesList() {
  const queryClient = useQueryClient();
  const { data: notes } = useSuspenseQuery(notesListQueryOptions());
  const mutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => invalidateNotes(queryClient),
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    if (!title) return;
    mutation.mutate({ title, body, favorite: false });
    form.reset();
  }

  return (
    <div>
      <h1>Notes</h1>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" required />
        <input name="body" placeholder="Body" />
        <button type="submit" disabled={mutation.isPending}>Add</button>
      </form>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <Link to="/notes/$id" params={{ id: String(note.id) }}>{note.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
