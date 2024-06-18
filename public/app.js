document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.getElementById('note-form');
    const noteContent = document.getElementById('note-content');
    const notesContainer = document.getElementById('notes');

    const fetchNotes = async () => {
        const response = await fetch('http://localhost:5000/notes');
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

            const editButton = document.createElement('button');
            editButton.innerText = 'Edit';
            editButton.addEventListener('click', () => editNote(note._id, note.content));
            noteElement.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.addEventListener('click', () => deleteNote(note._id));
            noteElement.appendChild(deleteButton);

            notesContainer.appendChild(noteElement);
        });
    };

    const addNote = async (content) => {
        const response = await fetch('http://localhost:5000/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        return response.json();
    };

    const updateNote = async (id, content) => {
        const response = await fetch(`http://localhost:5000/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        return response.json();
    };

    const deleteNote = async (id) => {
        await fetch(`http://localhost:5000/notes/${id}`, {
            method: 'DELETE'
        });
        fetchNotes();
    };

    const editNote = (id, content) => {
        const newContent = prompt('Edit your note:', content);
        if (newContent !== null) {
            updateNote(id, newContent).then(() => fetchNotes());
        }
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
