'use client';

import React, { useState, useEffect } from 'react';
import { Note } from '../page';

interface NoteFormProps {
  onSubmit: (note: Note) => void;
  editingNote: Note | null;
  onCancelEdit: () => void;
  existingNotes: Note[];
}

export default function NoteForm({ onSubmit, editingNote, onCancelEdit, existingNotes }: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setDescription(editingNote.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingNote]);

  useEffect(() => {
    if (!title.trim()) {
      setIsDuplicate(false);
      return;
    }

    const duplicateExists = existingNotes.some(
      (note: Note) =>
        note.title.trim().toLowerCase() === title.trim().toLowerCase() &&
        (!editingNote || note.id !== editingNote.id)
    );

    setIsDuplicate(duplicateExists);
  }, [title, existingNotes, editingNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmit({
      id: editingNote ? editingNote.id : Date.now(),
      title,
      description,
      date: editingNote ? editingNote.date : new Date().toLocaleDateString(),
    });

    if (!editingNote) {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h3>{editingNote ? 'Edit Note' : ' Add a New Note'}</h3>

      {isDuplicate && (
        <div className="duplicate-warning">
         <strong>Notice:</strong> A note with this title already exists!
        </div>
      )}

      <div className="form-group">
        <label>Note Title</label>
        <input
          type="text"
          placeholder="Enter note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          placeholder="Write your note description here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn-primary">
        {editingNote ? 'Update Note' : 'Add Note'}
      </button>

      {editingNote && (
        <button type="button" className="btn-secondary" onClick={onCancelEdit}>
          Cancel
        </button>
      )}
    </form>
  );
}
