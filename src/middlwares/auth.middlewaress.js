import jwt from "jsonwebtoken";
import note from "../DB/models/Note.model.js";

const key = process.env.SECRET_KEY;
function verifytoken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: `No Token provided` });
  try {
    const decoded = jwt.verify(token, key);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: `No Token provided ${err}` });
  }
}
export default verifytoken;

export const authOwnNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    if (!noteId) return res.status(404).json({ message: `noteId is required` });
    const Note = await note.findById(noteId);
    if (!Note) return res.status(404).json({ message: `Note not found` });
    if (Note.userId != req.user.id)
      return res.status(401).json({ message: `you 're not the owner` });
    next();
  } catch (err) {
    console.error("verifyBlogOwner error:", err);
    res.status(500).json({ message: `Something went wrong: ${err.message}` });
  }
};
