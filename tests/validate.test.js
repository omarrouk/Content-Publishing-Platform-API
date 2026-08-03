const test = require("node:test");
const assert = require("node:assert/strict");
const Joi = require("joi");
const validate = require("../src/middlewares/validate");
const { signupSchema } = require("../src/schemas/authSchemas");
const { updateProfileSchema } = require("../src/schemas/userSchemas");

function createReq(body = {}, method = "PATCH") {
  return {
    body,
    params: {},
    query: {},
    method,
  };
}

function createRes() {
  return {};
}

test("validate middleware accepts valid signup payload", (t) => {
  const req = createReq(
    {
      username: "jane",
      email: "jane@example.com",
      password: "password123",
      firstName: "Jane",
      lastName: "Doe",
    },
    "POST",
  );
  const res = createRes();
  let nextCalled = false;

  validate(signupSchema)(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.deepEqual(req.body, {
    username: "jane",
    email: "jane@example.com",
    password: "password123",
    firstName: "Jane",
    lastName: "Doe",
  });
});

test("validate middleware rejects invalid signup payload", (t) => {
  const req = createReq(
    {
      username: "j",
      email: "not-an-email",
      password: "short",
    },
    "POST",
  );
  const res = createRes();
  let error;

  validate(signupSchema)(req, res, (err) => {
    error = err;
  });

  assert.ok(error);
  assert.equal(error.statusCode, 400);
});

test("validate middleware aggregates errors from multiple request parts", () => {
  const schema = {
    body: Joi.object({
      username: Joi.string().min(3).required(),
    }),
    params: Joi.object({
      id: Joi.string().hex().length(24).required(),
    }),
  };

  const req = {
    body: {},
    params: { id: "invalid" },
    query: {},
  };
  const res = createRes();
  let error;

  validate(schema)(req, res, (err) => {
    error = err;
  });

  assert.ok(error);
  assert.match(error.message, /username/i);
  assert.match(error.message, /id/i);
});

test("email validation returns a friendly message", () => {
  const req = createReq(
    {
      username: "jane",
      email: "not-an-email",
      password: "password123",
      firstName: "Jane",
      lastName: "Doe",
    },
    "POST",
  );
  const res = createRes();
  let error;

  validate(signupSchema)(req, res, (err) => {
    error = err;
  });

  assert.ok(error);
  assert.match(error.message, /email is not valid/i);
});

test("profile update accepts an empty body when a file is present", () => {
  const req = createReq({});
  req.file = { fieldname: "profilePhoto" };
  const res = createRes();
  let nextCalled = false;

  validate(updateProfileSchema)(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.deepEqual(req.body, {});
});

test("query-only GET routes allow an empty body", () => {
  const schema = {
    query: Joi.object({
      page: Joi.number().integer().min(1),
    }),
  };

  const req = createReq({}, "GET");
  const res = createRes();
  let nextCalled = false;

  validate(schema)(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});
