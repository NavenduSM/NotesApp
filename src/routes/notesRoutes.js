import express from 'express';
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/notes.controller.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const routers = express.Router();


routers.get("/get-notes", checkAuth, getNotes);

routers.post("/create-note", checkAuth, createNote);

routers.put("/update-note/:noteId", checkAuth, updateNote);

routers.delete("/delete-note/:noteId", checkAuth, deleteNote);


export default routers;