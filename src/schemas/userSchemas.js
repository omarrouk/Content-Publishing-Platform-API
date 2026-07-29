const Joi = require("joi");
const {
  objectIdSchema,
  passwordSchema,
  emailSchema,
  stringFieldSchema,
} = require("./common");

const updateProfileSchema = Joi.object({
  username: stringFieldSchema("Username", { min: 3, max: 30 }),
  email: emailSchema.optional(),
  firstName: stringFieldSchema("First name", { min: 2, max: 50 }),
  lastName: stringFieldSchema("Last name", { min: 2, max: 50 }),
});

const changePasswordSchema = Joi.object({
  currentPassword: stringFieldSchema("Current password", {
    min: 8,
    max: 72,
    required: true,
  }),
  newPassword: passwordSchema,
});

const userIdSchema = Joi.object({
  id: objectIdSchema,
});

const updateUserRoleSchema = {
  params: Joi.object({
    userId: objectIdSchema,
  }),
  body: Joi.object({
    newRole: Joi.string()
      .trim()
      .uppercase()
      .valid("ADMIN", "USER")
      .required()
      .messages({
        "any.only": "Role must be either ADMIN or USER",
        "any.required": "Role is required",
      }),
  }),
};

const deleteUserAccountSchema = {
  params: Joi.object({
    id: objectIdSchema,
  }),
};

const followUserSchema = {
  params: Joi.object({
    id: objectIdSchema,
  }),
};

module.exports = {
  updateProfileSchema,
  changePasswordSchema,
  userIdSchema,
  updateUserRoleSchema,
  deleteUserAccountSchema,
  followUserSchema,
};
