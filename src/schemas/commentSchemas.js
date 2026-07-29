const Joi = require("joi");
const { objectIdSchema } = require("./common");

const deleteUserCommentSchema = {
  params: Joi.object({
    commentId: objectIdSchema,
  }),
};

module.exports = {
  deleteUserCommentSchema,
};
