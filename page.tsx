'use client';

import React, { useState, useEffect } from 'react';
import NoteForm from './components/NoteForm';
import NoteItem from './components/NoteItem';

export interface Note {
  id: number;
  title: string;
  description: string;
  date: string;
}

export default function Page() {

  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: 'Welcome to Tejedor Note App',
      description: 'Create, edit, and manage your daily scrapbook notes here!',
      date: new Date().toLocaleDateString(),
    },
  ]);

  const [isMounted, setIsMounted] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedNotes = localStorage.getItem('tejedor_nostalgia_notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to parse notes from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('tejedor_nostalgia_notes', JSON.stringify(notes));
    }
  }, [notes, isMounted]);

  const handleSaveNote = (noteData: Note) => {
    if (editingNote) {
      setNotes(notes.map((n) => (n.id === noteData.id ? noteData : n)));
      setEditingNote(null);
    } else {
      setNotes([noteData, ...notes]);
    }
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (editingNote && editingNote.id === id) {
      setEditingNote(null);
    }
  };

  const handleStartEdit = (note: Note) => {
    setEditingNote(note);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="app-container">
      <h1 className="app-title">Add your note here</h1>
      <p className="app-subtitle">The Nostalgia Note Application</p>
      <div className="checkerboard-banner"></div>

      <NoteForm
        onSubmit={handleSaveNote}
        editingNote={editingNote}
        onCancelEdit={() => setEditingNote(null)}
        existingNotes={notes}
      />

      <div className="notes-section">
        <h2>Your Created Notes ({notes.length})</h2>
        {notes.length === 0 ? (
          <p className="empty-state">No notes found. Add your first note above!</p>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onEdit={handleStartEdit}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
