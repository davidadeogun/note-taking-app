document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.getElementById('note-form');
    const noteContent = document.getElementById('note-content');
    const notesContainer = document.getElementById('notes');
  
    const fetchNotes = async () => {
      const response = await fetch('/api/notes');
      const notes = await response.json();
      renderNotes(notes);
    };
  
    const renderNotes = (notes) => {
      notesContainer.innerHTML = '';
      notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
  
        const noteText = document.createElement('p');
        noteText.innerText = note.content;
        noteElement.appendChild(noteText);
  
        notesContainer.appendChild(noteElement);
      });
    };
  
    const addNote = async (content) => {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      return response.json();
    };
  
    noteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const content = noteContent.value;
      if (content.trim()) {
        await addNote(content);
        noteContent.value = '';
        fetchNotes();
      }
    });
  
    fetchNotes();
  });
  