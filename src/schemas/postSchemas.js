const Joi = require("joi");
const { objectIdSchema, stringFieldSchema } = require("./common");

const createPostSchema = Joi.object({
  text: stringFieldSchema("Post text", { min: 1, max: 1000, required: true }),
});

const getPostsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(50),
  newestFirst: Joi.boolean(),
});

const editPostSchema = {
  params: Joi.object({
    id: objectIdSchema,
  }),
  body: Joi.object({
    text: stringFieldSchema("Post text", { min: 1, max: 1000, required: true }),
  }),
};

const deletePostSchema = {
  params: Joi.object({
    id: objectIdSchema,
  }),
};

const toggleLikeSchema = {
  params: Joi.object({
    id: objectIdSchema,
  }),
};

const addCommentSchema = {
  params: Joi.object({
    id: objectIdSchema,
  }),
  body: Joi.object({
    text: stringFieldSchema("Comment text", {
      min: 1,
      max: 500,
      required: true,
    }),
  }),
};

const editCommentSchema = {
  params: Joi.object({
    postId: objectIdSchema,
    commentId: objectIdSchema,
  }),
  body: Joi.object({
    text: stringFieldSchema("Comment text", {
      min: 1,
      max: 500,
      required: true,
    }),
  }),
};

const deleteCommentSchema = {
  params: Joi.object({
    postId: objectIdSchema,
    commentId: objectIdSchema,
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
  toggleLikeSchema,
  addCommentSchema,
  editCommentSchema,
  deleteCommentSchema,
  deleteUserPostSchema,
};
