import { Note } from "../models/note.model.js";

export const getNotes = async (req, res) => {
    try {   
        const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, notes }); 
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const createNote = async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ success: false, message: "Title and content are required" });
    }
    try {
        const note = new Note({
            title,
            content,
            userId: req.user.id
        });
        await note.save();
        res.status(201).json({ success: true, message: "Note created successfully", note });
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const updateNote = async (req, res) => {
    const { noteId } = req.params;
    const { title, content } = req.body;    
    if (!noteId) {
        return res.status(400).json({ success: false, message: "Note ID with title or content are required" });
    }
    try {
        const note = await Note.findOneAndUpdate({ _id: noteId, userId: req.user.id }, 
            { title, content },
            { new: true }
        );
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
        res.status(200).json({ success: true, message: "Note updated successfully", note });
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const deleteNote = async (req, res) => {
    const { noteId } = req.params;
    if (!noteId) {
        return res.status(400).json({ success: false, message: "Note ID is required" });
    }
    try {
        const note = await Note.findOneAndDelete({ _id: noteId, userId: req.user.id });
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }
        res.status(200).json({ success: true, message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

