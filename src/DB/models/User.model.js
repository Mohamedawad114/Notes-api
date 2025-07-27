import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [4, "name length must be 4 at least"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    otps: {
      confirmation: String,
      reset: String,
    },
    isConfirmation: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

Userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
const user = mongoose.model("user", Userschema);
export default user;
