import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "notes.json");

export type Note = {
  id: number;
  title: string;
  body?: string;
  favorite: boolean;
};

export async function readNotes(): Promise<Note[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    const initial: Note[] = [];
    await writeNotes(initial);
    return initial;
  }
}

export async function writeNotes(notes: Note[]) {
  await fs.writeFile(filePath, JSON.stringify(notes, null, 2), "utf-8");
}

export async function addNote(note: Omit<Note, "id">) {
  const notes = await readNotes();
  const newNote = { ...note, id: Date.now() };
  notes.push(newNote);
  await writeNotes(notes);
  return newNote;
}

export async function updateNote(id: number, data: Partial<Note>) {
  const notes = await readNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) throw new Error("Not found");
  notes[idx] = { ...notes[idx], ...data };
  await writeNotes(notes);
  return notes[idx];
}

export async function deleteNote(id: number) {
  const notes = await readNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) throw new Error("Not found");
  const [deleted] = notes.splice(idx, 1);
  await writeNotes(notes);
  return deleted;
}

export async function getNoteById(id: number) {
  const notes = await readNotes();
  return notes.find((n) => n.id === id) ?? null;
}
