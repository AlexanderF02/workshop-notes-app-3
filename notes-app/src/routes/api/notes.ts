import * as notes from '../../api/notes';

export async function GET({ request }: any) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (id) {
    const note = await notes.getNoteById(Number(id));
    if (!note) return new Response('Not found', { status: 404 });
    return Response.json(note);
  }
  const allNotes = await notes.readNotes();
  return Response.json(allNotes);
}

export async function POST({ request }: any) {
  const data = await request.json();
  const newNote = await notes.addNote(data);
  return Response.json(newNote);
}

export async function PUT({ request }: any) {
  const data = await request.json();
  if (!data.id) return new Response('Missing id', { status: 400 });
  const updated = await notes.updateNote(Number(data.id), data);
  return Response.json(updated);
}

export async function DELETE({ request }: any) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return new Response('Missing id', { status: 400 });
  const deleted = await notes.deleteNote(Number(id));
  return Response.json(deleted);
}
