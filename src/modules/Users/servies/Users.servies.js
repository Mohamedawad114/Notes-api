import encryption from "../../../utlies/encryption.js";
import decryption from "../../../utlies/decryption.js";
import asyncHandler from "express-async-handler";
import user from "../../../DB/models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";
import {
  validateUser,
  validateloginUser,
  validateupdateUser,
  validatePassword,
  validateotp,
} from "../../../middlwares/users.validator.js";
import {
  increaseloginattemp,
  resetloginattemp,
} from "../../../middlwares/loginRatelimit.js";
import SendEmail, { emittir } from "../../../utlies/send-email.js";
import dotenv from "dotenv";
dotenv.config();

const generateOtp = customAlphabet("0123456789mnbvczdokptqwueig", 6);

export const signup = asyncHandler(async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const { name, email, password, age, phone } = req.body;
  if (!name || !email || !password || !age || !phone)
    return res.status(400).json({ Message: `all inputs required` });
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const valid_email = await user.findOne({ email });
  if (valid_email)
    return res.status(409).json({ message: `email already existed ` });
  const otp = generateOtp();
  const create = await user.create({
    name,
    password,
    email,
    phone: encryption(phone),
    age,
    otps: { confirmation: await bcrypt.hash(otp, salt) },
  });

  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="color: #333;">مرحبا بك!</h2>
      <p>شكراً لتسجيلك. الكود الخاص بك لتأكيد الحساب هو:</p>
      <h1 style="color: #007BFF; text-align: center;">${otp}</h1>
      <p>من فضلك أدخل هذا الكود في التطبيق لتفعيل حسابك.</p>
      <hr />
      <p style="font-size: 12px; color: #888;">إذا لم تطلب هذا الكود، تجاهل هذه الرسالة.</p>
    </div>
  </div>
`;
  if (create)
    emittir.emit("sendemail", {
      to: email,
      subject: "Confirmation Email",
      html: html,
    });
  return res.status(201).json({ message: `signup done` });
});
export const confirmOtp = asyncHandler(async (req, res) => {
  const { otp, email } = req.body;
  const User = await user.findOne({ email: email, isConfirmation: false });
  if (!User)
    return res.status(400).json({ message: `email is already confirmed ` });
  if (!otp) return res.status(400).json({ message: `please input the OTP` });
  const { error } = validateotp(otp);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const isConfirmed = await bcrypt.compare(otp, User.otps?.confirmation);
  if (!isConfirmed) return res.status(400).json({ message: "Invalid OTP" });
  User.isConfirmation = true;
  User.otps.confirmation = undefined;
  await User.save();
  return res.status(200).json({ message: `email is confirmed ` });
});
export const loginuser = asyncHandler(async (req, res) => {
  const key = process.env.SECRET_KEY;
  const ip = req.ip;
  const { password, email } = req.body;
  const { error } = validateloginUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const valid_email = await user.findOne({ email: email });
  if (!valid_email) {
    await increaseloginattemp(ip);
    return res.status(404).json({ message: `email not found` });
  }
  const passMatch = await bcrypt.compare(password, valid_email.password);
  if (!passMatch) {
    await increaseloginattemp(ip);
    return res.status(400).json({ message: ` invalid email  or password` });
  }
  const token = jwt.sign(
    {
      id: valid_email._id,
    },
    key,
    { expiresIn: "7d" }
  );
  await resetloginattemp(ip);
  return res.status(200).json({ message: `login seccussful`, token });
});
export const updateUser = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const { email, name, age, phone } = req.body;
  if (await user.findOne({ email: email }))
    return res.status(409).json({ message: `email is already existed` });
  const { error } = validateupdateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const findUser = await user.findByIdAndUpdate(id, {
    name,
    age,
    email,
    phone: encryption(phone),
  });
  if (!findUser) return res.status(404).json({ message: `user not found ` });
  return res.status(200).json({ message: `profile updated` });
});
export const deleteuser = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const findUser = await user.findByIdAndDelete(id);
  if (!findUser) return res.status(404).json({ message: `user not found ` });
  return res.status(200).json({ message: `profile deleted` });
});
export const userdata = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const userData = await user.findById(id);
  if (!userData) return res.status(404).json({ message: `user not found ` });
  userData.phone = decryption(userData.phone);
  return res.status(200).json({ userData });
});
export const resetPasswordReq = asyncHandler(async (req, res) => {
  const User = await user.findById(req.user.id);
  if (!User) return res.status(404).json({ message: "User not found" });
  const otp = generateOtp();
  User.otps.reset = await bcrypt.hash(otp, 10);
  await User.save();
  const resetHtml = `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333;">طلب إعادة تعيين كلمة المرور</h2>
    <p style="font-size: 16px; color: #555;">لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك. من فضلك استخدم رمز التحقق (OTP) أدناه لإتمام العملية:</p>
    <div style="margin: 20px 0; padding: 20px; background-color: #f1f5ff; border-radius: 8px; text-align: center;">
      <h1 style="font-size: 36px; letter-spacing: 4px; color: #007BFF;">${otp}</h1>
    </div>
    <p style="font-size: 14px; color: #777;">الرمز صالح لفترة محدودة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان.</p>
    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #999;">© 2025 Notes. جميع الحقوق محفوظة.</p> 
  </div>
</div>`;
  emittir.emit("sendemail", {
    to: User.email,
    content: "Reset Password",
    html: resetHtml,
  });
  return res.status(200).json({ message: `OTP is sent` });
});
export const resetPasswordconfirm = asyncHandler(async (req, res) => {
  const { OTP, newPassword } = req.body;
  const User = await user.findById(req.user.id);
  if (!User) return res.status(404).json({ message: "User not found" });
  if (!OTP || !newPassword)
    return res
      .status(400)
      .json({ message: "Both OTP and new passwords are required" });
  const isMatch = await bcrypt.compare(OTP, User.otps?.reset);
  if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });
  const { error } = validatePassword(newPassword);
  if (error)
    return res
      .status(400)
      .json({ message: `password length must greater than 6 or equal ` });
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(newPassword, salt);
  User.password = hashpassword;
  User.otps.reset = undefined;
  await User.save();
  return res.status(200).json({ message: `password updated` });
});
