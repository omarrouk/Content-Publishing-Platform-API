const Joi = require("joi");
const { objectIdSchema, stringFieldSchema } = require("./common");

const createPostSchema = Joi.object({
  text: stringFieldSchema("Post text", { min: 1, required: true }),
});

const getPostsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).label("Page").messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).max(100).label("Limit").messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit must be at most 100",
  }),
  newestFirst: Joi.boolean().label("Newest First").messages({
    "boolean.base": "Newest First must be a boolean",
  }),
});

const editPostSchema = {
  params: Joi.object({
    id: objectIdSchema,
  }),
  body: Joi.object({
    text: stringFieldSchema("Post text", { min: 1, required: true }),
  }),
};

const deletePostSchema = {
  params: Joi.object({
    id: objectIdSchema,
  }),
};

const deleteUserPostSchema = {
  params: Joi.object({
    postId: objectIdSchema,
  }),
};

module.exports = {
  createPostSchema,
  getPostsQuerySchema,
  editPostSchema,
  deletePostSchema,
  deleteUserPostSchema,
};
