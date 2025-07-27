import joi from "joi";

function validatenote(obj) {
  const Schema = joi.object({
    title: joi
      .string()
      .required()
      .min(4)
      .trim()
      .message("name length must 4 at least"),
    content: joi.string().required().messages({
      "string.min": "Title must be at least 4 characters long",
      "any.required": "Title is required",
    }),
  });
  return Schema.validate(obj);
}
function validatereplacenote(obj) {
  const Schema = joi.object({
    userId: joi.string().trim(),
    title: joi.string().min(4).trim().message("name length must 4 at least"),
    content: joi.string().messages({
      "string.min": "Title must be at least 4 characters long",
      "any.required": "Title is required",
    }),
  });
  return Schema.validate(obj);
}
function validateupdatenote(obj) {
  const Schema = joi.object({
    title: joi.string().min(4).trim().messages({
      "string.min": "Title must be at least 4 characters long",
    }),
    content: joi.string(),
  });
  return Schema.validate(obj);
}

export { validatenote, validateupdatenote, validatereplacenote };
