import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Save } from 'lucide-react';

function App() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '' });
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load notes from localStorage on mount
  useEffect(() => {
    const storedNotes = localStorage.getItem("quraDocs");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    } else {
      const defaultNotes = [
        {
          id: 1,
          title: "Welcome to Qura Docs",
          content: "This is your first note. Click on any note to edit it!",
          updatedAt: new Date().toISOString(),
        },
      ];
      setNotes(defaultNotes);
      localStorage.setItem("quraDocs", JSON.stringify(defaultNotes));
    }
    setLoading(false);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("quraDocs", JSON.stringify(notes));
    }
  }, [notes]);

  const createNewNote = () => {
    setCurrentNote({ id: Date.now(), title: '', content: '' });
    setShowEditor(true);
  };

  const saveNote = () => {
    if (!currentNote.title && !currentNote.content) return;

    const noteToSave = {
      ...currentNote,
      title: currentNote.title || 'Untitled Note',
      updatedAt: new Date().toISOString()
    };

    setNotes(prevNotes => {
      const existingIndex = prevNotes.findIndex(n => n.id === currentNote.id);
      if (existingIndex >= 0) {
        const updated = [...prevNotes];
        updated[existingIndex] = noteToSave;
        return updated;
      }
      return [noteToSave, ...prevNotes];
    });

    setShowEditor(false);
    setCurrentNote({ id: null, title: '', content: '' });
  };

  const deleteNote = (id) => {
    setNotes(prevNotes => prevNotes.filter(n => n.id !== id));
    if (currentNote.id === id) {
      setCurrentNote({ id: null, title: '', content: '' });
      setShowEditor(false);
    }
  };

  const openNote = (note) => {
    setCurrentNote({ ...note });
    setShowEditor(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto text-indigo-600 animate-pulse mb-4" size={48} />
          <p className="text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (showEditor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Note</h1>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={saveNote}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex-1 sm:flex-none text-sm sm:text-base"
                >
                  <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowEditor(false);
                    setCurrentNote({ id: null, title: '', content: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex-1 sm:flex-none text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>

            <input
              type="text"
              placeholder="Note title..."
              value={currentNote.title}
              onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
              className="w-full text-lg sm:text-xl font-semibold mb-4 px-3 py-2 border-b-2 border-gray-200 focus:border-indigo-600 outline-none"
            />

            <textarea
              placeholder="Start typing your note..."
              value={currentNote.content}
              onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
              className="w-full h-64 sm:h-96 p-3 sm:p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none resize-none text-sm sm:text-base"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <FileText className="text-indigo-600" size={32} />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">Qura Docs</h1>
          </div>
          <p className="text-gray-600 text-base sm:text-lg px-4">Your personal note-taking space</p>
        </div>

        {/* New Note Button */}
        <div className="flex justify-center mb-6 sm:mb-8 px-4">
          <button
            onClick={createNewNote}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            Create New Note
          </button>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="text-center py-12 sm:py-20 px-4">
            <FileText className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg sm:text-xl">No notes yet. Create your first note!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
            {notes.map(note => (
              <div
                key={note.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 sm:p-6 cursor-pointer group"
                onClick={() => openNote(note)}
              >
                <div className="flex justify-between items-start mb-2 sm:mb-3 gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition truncate flex-1">
                    {note.title || 'Untitled Note'}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="text-gray-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 mb-3 sm:mb-4">
                  {note.content || 'Empty note'}
                </p>
                {note.updatedAt && (
                  <p className="text-xs text-gray-400">
                    {formatDate(note.updatedAt)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;