const Joi = require("joi");
const { objectIdSchema, stringFieldSchema } = require("./common");

const addCommentSchema = {
  params: Joi.object({
    id: objectIdSchema,
  }),
  body: Joi.object({
    text: stringFieldSchema("Comment text", {
      min: 1,
      max: 1000,
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
      max: 1000,
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

const deleteUserCommentSchema = {
  params: Joi.object({
    commentId: objectIdSchema,
  }),
};

module.exports = {
  addCommentSchema,
  editCommentSchema,
  deleteCommentSchema,
  deleteUserCommentSchema,
};
