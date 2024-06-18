const mongoose = require('mongoose');
require('dotenv').config();

const NoteSchema = new mongoose.Schema({
    content: String,
    createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', NoteSchema);

const handler = async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    if (req.method === 'GET') {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.status(200).json(notes);
    } else if (req.method === 'POST') {
        const newNote = new Note({
            content: req.body.content
        });
        await newNote.save();
        res.status(201).json(newNote);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

module.exports = handler;
