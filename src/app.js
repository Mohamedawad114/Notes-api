import express from "express";
import helmet from "helmet";
import env from "dotenv";
import db_connection from "./DB/db.connection.js";
import user_controllor from "./modules/Users/users.controllor.js";
import note_controllor from './modules/Note/Note.controllor.js'
import hpp from 'hpp';

const app = express();
app.use(helmet());
env.config();
app.use(hpp());
app.use(express.json());


app.use("/users", user_controllor);
app.use("/notes", note_controllor);

await db_connection();

app.use((err, req, res, next) => {
  res.status(500).send(`something wrong: ${err.message}`);
});

app.use((req, res) => {
  res.status(404).json({message:`Page Not Found`});
});

export default app;
