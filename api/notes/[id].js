const mongoose = require('mongoose');
require('dotenv').config();

const NoteSchema = new mongoose.Schema({
    content: String,
    createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', NoteSchema);

const handler = async (req, res) => {
    await mongoose.connect(process.env.MONGODB_URI);

    const { id } = req.query;

    if (req.method === 'PUT') {
        const updatedNote = await Note.findByIdAndUpdate(id, { content: req.body.content }, { new: true });
        res.status(200).json(updatedNote);
    } else if (req.method === 'DELETE') {
        await Note.findByIdAndDelete(id);
        res.status(200).json({ message: 'Note deleted' });
    } else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

module.exports = handler;
