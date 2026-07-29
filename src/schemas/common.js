const Joi = require("joi");

const objectIdSchema = Joi.string().hex().length(24).required().messages({
  "string.hex": "Provide a valid id",
  "string.length": "Provide a valid id",
  "any.required": "Provide a valid id",
});

const passwordSchema = Joi.string().trim().min(8).max(72).required().messages({
  "string.min": "Password must be at least 8 characters long",
  "string.max": "Password must not exceed 72 characters",
  "any.required": "Password is required",
});

const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .trim()
  .lowercase()
  .required()
  .messages({
    "string.email": "Email is not valid",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  });

const stringFieldSchema = (label, { min, max, required = false } = {}) => {
  let schema = Joi.string().trim();

  if (min !== undefined) schema = schema.min(min);
  if (max !== undefined) schema = schema.max(max);
  if (required) schema = schema.required();

  return schema.messages({
    "string.base": `${label} must be a string`,
    "string.empty": `${label} is required`,
    "string.min": `${label} must be at least ${min} characters long`,
    "string.max": `${label} must not exceed ${max} characters`,
    "any.required": `${label} is required`,
  });
};

module.exports = {
  objectIdSchema,
  passwordSchema,
  emailSchema,
  stringFieldSchema,
};
