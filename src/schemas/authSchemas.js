const Joi = require("joi");
const { passwordSchema, emailSchema, stringFieldSchema } = require("./common");

const signupSchema = Joi.object({
  username: stringFieldSchema("Username", { min: 3, max: 30, required: true }),
  email: emailSchema,
  password: passwordSchema,
  firstName: stringFieldSchema("First name", {
    min: 2,
    max: 50,
    required: true,
  }),
  lastName: stringFieldSchema("Last name", { min: 2, max: 50, required: true }),
});

const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

const forgotPasswordSchema = Joi.object({
  email: emailSchema,
});

const resetPasswordSchema = {
  body: Joi.object({
    newPassword: passwordSchema,
  }),
  query: Joi.object({
    resetToken: stringFieldSchema("Reset token", { required: true }),
  }),
};

module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
