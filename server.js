const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI,)
    .then(() => console.log('Database is connected'))
    .catch(err => console.log(err));

// Note schema
const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Note model
const Note = mongoose.model('Note', noteSchema);

// Routes
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/notes', async (req, res) => {
    const newNote = new Note({
        content: req.body.content
    });

    try {
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/notes/:id', async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { content: req.body.content },
            { new: true }
        );
        res.json(updatedNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Serve static assets if in production
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
