type Note = {
  id: number;
  title: string;
  body?: string;
  favorite: boolean;
};

const isServer = typeof window === 'undefined';
const apiBase = isServer ? 'http://localhost:3001' : '';

export const notesListQueryOptions = () => ({
  queryKey: ['notes'],
  queryFn: async (): Promise<Note[]> => {
    const res = await fetch(`${apiBase}/api/notes`);
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  },
});

export const noteByIdQueryOptions = (id: number) => ({
  queryKey: ['notes', id],
  queryFn: async (): Promise<Note> => {
    const res = await fetch(`${apiBase}/api/notes/${id}`);
    if (!res.ok) throw new Error('Not found');
    return res.json();
  },
});

export async function addNote(note: Omit<Note, 'id'>) {
  const res = await fetch(`${apiBase}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error('Failed to add note');
  return res.json();
}

export async function updateNote(id: number, data: Partial<Note>) {
  const res = await fetch(`${apiBase}/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data }),
  });
  if (!res.ok) throw new Error('Failed to update note');
  return res.json();
}

export async function deleteNote(id: number) {
  const res = await fetch(`${apiBase}/api/notes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete note');
  return res.json();
}

export function invalidateNotes(queryClient: any) {
  return queryClient.invalidateQueries({ queryKey: ['notes'] });
}