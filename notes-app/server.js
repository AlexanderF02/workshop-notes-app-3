import express from 'express';
import cors from 'cors';
import { readFile, writeFile } from 'fs/promises';

const app = express();
const PORT = 3001;
const filePath = './notes.json';

app.use(cors());
app.use(express.json());

// Hämta alla anteckningar
app.get('/api/notes', async (req, res) => {
  try {
    const data = await readFile(filePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read notes' });
  }
});

// Hämta en anteckning
app.get('/api/notes/:id', async (req, res) => {
  try {
    const data = await readFile(filePath, 'utf-8');
    const notes = JSON.parse(data);
    const note = notes.find(n => n.id === Number(req.params.id));
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read notes' });
  }
});

// Skapa en anteckning
app.post('/api/notes', async (req, res) => {
  try {
    const data = await readFile(filePath, 'utf-8');
    const notes = JSON.parse(data);
    const newNote = { ...req.body, id: Date.now() };
    notes.push(newNote);
    await writeFile(filePath, JSON.stringify(notes, null, 2), 'utf-8');
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// Uppdatera en anteckning
app.put('/api/notes/:id', async (req, res) => {
  try {
    const data = await readFile(filePath, 'utf-8');
    const notes = JSON.parse(data);
    const idx = notes.findIndex(n => n.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    notes[idx] = { ...notes[idx], ...req.body };
    await writeFile(filePath, JSON.stringify(notes, null, 2), 'utf-8');
    res.json(notes[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Ta bort en anteckning
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const data = await readFile(filePath, 'utf-8');
    let notes = JSON.parse(data);
    const idx = notes.findIndex(n => n.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    notes.splice(idx, 1);
    await writeFile(filePath, JSON.stringify(notes, null, 2), 'utf-8');
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

app.listen(PORT, () => {
  console.log(`Notes API server running on http://localhost:${PORT}`);
});
