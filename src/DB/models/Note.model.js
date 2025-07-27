import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [4, "title length must be 4 at least"],
      validate: {
        validator: function (value) {
          return value !== value.toUpperCase();
        },
        message: "no write title in upperCase",
      },
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      message: `Invalid userId`,
    },
  },
  {
    timestamps: true,
  }
);

const note = mongoose.model("note", noteSchema);
export default note;
