const Joi = require("joi");
const { objectIdSchema } = require("./common");

const followUserSchema = {
  params: Joi.object({
    id: objectIdSchema,
  }),
};

module.exports = {
  followUserSchema,
};
