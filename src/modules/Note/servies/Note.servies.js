import asyncHandler from "express-async-handler";
import {
  validatenote,
  validateupdatenote,
  validatereplacenote,
} from "../../../middlwares/Note.validator.js";
import note from "../../../DB/models/Note.model.js";
import mongoose from "mongoose";

export const createNote = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ message: `All input required` });
  const { error } = validatenote(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const created = await note.create({ title, content, userId: userId });
  return res.status(201).json({ message: `Note created` });
});
export const updateNote = asyncHandler(async (req, res) => {
  const noteId = req.params.id;
  const { title, content } = req.body;
  const { error } = validateupdatenote(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const updated = await note.updateOne({ _id: noteId }, { title, content });
  const Note = await note.findById(noteId);
  if (updated.modifiedCount)
    return res.status(200).json({ message: ` updated`, Note });
  return res.status(400).json({ message: `Note not updated` });
});
export const replaceNote = asyncHandler(async (req, res) => {
  const noteId = req.params.id;
  const { title, content, userId } = req.body;
  const { error } = validatereplacenote(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const updated = await note.updateOne(
    { _id: noteId },
    { title, content, userId }
  );
  const Note = await note.findById(noteId);
  if (updated.modifiedCount) return res.status(200).json({ Note });
  return res.status(400).json({ message: `Note not replace` });
});
export const notesTitle = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: `title is required` });
  const userId = req.user.id;
  const notes = await note.find({ userId: userId });
  if (notes.length == 0)
    return res.status(200).json({ message: ` No note found` });
  const updated = await note.updateMany({ userId: userId }, { title: title });
  if (updated.modifiedCount)
    return res.status(200).json({ message: `All notes updated` });
});
export const deleteNote = asyncHandler(async (req, res) => {
  const noteId = req.params.id;
  const Note = await note.findById(noteId);
  const deleted = await note.deleteOne({ _id: noteId });
  if (deleted.deletedCount)
    return res.status(200).json({ message: `deleted`, Note });
  return res.status(400).json({ message: `Note not deleted` });
});
export const userNotes = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page);
  const limit = 3;
  const offest = (page - 1) * limit;
  const Notes = await note
    .find({ userId: userId })
    .sort({ createdAt: -1 })
    .skip(offest)
    .limit(limit);
  if (Notes.length > 0) return res.status(200).json({ Notes });
  return res.status(200).json({ message: `no notes founded` });
});
export const usernote = asyncHandler(async (req, res) => {
  const noteId = req.params.id;
  const Note = await note.findById(noteId, { __v: 0 });
  if (Note) return res.status(200).json({ Note });
  return res.status(404).json({ message: `Note not found` });
});

export const notecontent = asyncHandler(async (req, res) => {
  const content = req.query.content;
  const userId = req.user.id;
  const Note = await note.findOne(
    { content: content, userId: userId },
    { __v: 0 }
  );
  if (Note) return res.status(200).json({ Note });
  return res.status(404).json({ message: `Note not found` });
});
export const noteWithUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const Notes = await note
    .find({ userId: userId }, { _id: 1, createdAt: 1, title: 1 })
    .populate({
      path: "userId",
      select: "email -_id",
    });
  if (Notes.length == 0)
    return res.status(404).json({ message: `Notes not found` });
  return res.status(200).json({ Notes });
});
export const notes = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const title = req.query.title;
  const notes = await note.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        ...(title && { title: title }),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        title: 1,
        _id: 0,
        userId: 1,
        createdAt: 1,
        "user.email": 1,
        "user.name": 1,
      },
    },
  ]);
  if (notes.length === 0) {
    return res.status(404).json({ message: "No notes found for this user." });
  }
  return res.status(200).json({ notes });
});
export const deleteNotes = asyncHandler(async (req, res) => {
  const deleted = await note.deleteMany({ userId: req.user.id });
  if (deleted.deletedCount) return res.status(200).json({ message: `deleted` });
  return res.status(400).json({ message: `Notes not deleted` });
});
