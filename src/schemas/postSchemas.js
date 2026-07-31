const Joi = require("joi");
const { objectIdSchema, stringFieldSchema } = require("./common");

const createPostSchema = Joi.object({
  text: stringFieldSchema("Post text", { min: 1, required: true }),
});

const getPostsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  newestFirst: Joi.boolean(),
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
