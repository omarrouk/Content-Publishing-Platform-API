const AppError = require("../utils/AppError");

const validate = (schema) => (req, res, next) => {
  try {
    const schemaMap =
      schema &&
      typeof schema === "object" &&
      !Array.isArray(schema) &&
      ("body" in schema || "params" in schema || "query" in schema)
        ? schema
        : { body: schema };

    const parts = ["body", "params", "query"];
    const allErrors = [];
    const hasFileUpload = Boolean(req.file || req.files);
    const emptyBody =
      req.body === undefined ||
      req.body === null ||
      (typeof req.body === "object" && !Object.keys(req.body).length);

    if (emptyBody && hasFileUpload) {
      req.body = {};
    } else if (emptyBody && !hasFileUpload) {
      allErrors.push("Provide at least one field to update");
    }

    for (const part of parts) {
      const schemaForPart = schemaMap[part];
      if (!schemaForPart) continue;

      const valueToValidate = req[part];
      const { error, value } = schemaForPart.validate(valueToValidate, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      });

      if (error) {
        allErrors.push(...error.details.map((detail) => detail.message));
        continue;
      }

      req[part] = value;
    }

    if (allErrors.length > 0) {
      const message = allErrors.join(", ");
      return next(new AppError(message, 400));
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = validate;
