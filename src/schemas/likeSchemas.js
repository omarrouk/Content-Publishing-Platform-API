const Joi = require("joi");
const { objectIdSchema } = require("./common");

const toggleLikeSchema = {
  params: Joi.object({
    id: objectIdSchema,
  }),
};

module.exports = {
  toggleLikeSchema,
};
