import joi from "joi";

function validateUser(obj) {
  const Schema = joi.object({
    name: joi.string().required().min(4).message("name length must 4 at least"),
    email: joi
      .string()
      .required()
      .email()
      .regex(/^[a-zA-Z0-9-.+#]+@gmail.com$/)
      .trim()
      .lowercase()
      .message("invalid Email"),
    age: joi.number().required().max(60).min(18),
    phone: joi
      .string()
      .required()
      .trim()
      .regex(/^01[0|2|5|1]\d{8}$/),
    password: joi.string().required().min(6),
  });
  return Schema.validate(obj);
}

function validateloginUser(obj) {
  const Schema = joi.object({
    email: joi
      .string()
      .required()
      .email()
      .regex(/^[a-zA-Z0-9-#]+@gmail.com$/)
      .trim()
      .lowercase()
      .message("invalid Email"),
    password: joi.string().required().min(6).message("Invalid password"),
  });
  return Schema.validate(obj);
}

function validateupdateUser(obj) {
  const Schema = joi.object({
    name: joi.string().min(4).message("name length must 4 at least"),
    email: joi
      .string()
      .email()
      .regex(/^[a-zA-Z0-9-#]+@gmail.com$/)
      .trim()
      .lowercase()
      .message("invalid Email"),
    phone: joi
      .string()
      .trim()
      .regex(/^01[1|2|0|5]\d{8}$/),
  });
  return Schema.validate(obj);
}
function validatePassword(password) {
  const schema = joi.string().min(6).required().messages({
    "string.min": "Password should be at least 6 characters",
    "any.required": "Password is required",
  });
  return schema.validate(password);
}
function validateotp(otp) {
  const schema = joi.string().length(6).required().messages({
    "string.min": "OTP should be 6 characters",
    "any.required": "OTP is required",
  });
  return schema.validate(otp);
}

export {
  validateUser,
  validateupdateUser,
  validateloginUser,
  validatePassword,
  validateotp,
};
