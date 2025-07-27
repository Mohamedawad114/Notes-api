import exprees from 'express'
import* as notes_serv from './servies/Note.servies.js'
import verifytoken, { authOwnNote } from '../../middlwares/auth.middlewaress.js'
const controllor=exprees.Router()



controllor.post('/create',verifytoken,notes_serv.createNote)
controllor.patch('/update/:id',verifytoken,authOwnNote,notes_serv.updateNote)
controllor.put('/replace/:id',verifytoken,authOwnNote,notes_serv.replaceNote)
controllor.patch('/allnotestitle',verifytoken,notes_serv.notesTitle)
controllor.delete('/delete/:id',verifytoken,authOwnNote,notes_serv.deleteNote)
controllor.get('/allnotes',verifytoken,notes_serv.userNotes)
controllor.get('/search/:id',verifytoken,authOwnNote,notes_serv.usernote)
controllor.get('/search',verifytoken,notes_serv.notecontent)
controllor.get('/note-with-user',verifytoken,notes_serv.noteWithUser)
controllor.get('/aggergate',verifytoken,notes_serv.notes)
controllor.delete('/deletenotes',verifytoken,notes_serv.deleteNotes)



export default controllor