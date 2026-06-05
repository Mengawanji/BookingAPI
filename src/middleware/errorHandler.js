import logger from "../config/logger.js";

const createErrorResponse = (status, message, code) => ({
  error: {
    code,
    message,
    status,
  },
});

export const errorHandler = (err, req, res, next) => {
  logger.error(
    {
      err,
      url: req.url,
      method: req.method,
      status: err.status ?? 500,
    },
    err.message
  );

  if (err.name === "ValidationError") {
    return res
      .status(400)
      .json(createErrorResponse(400, err.message, "VALIDATION_ERROR"));
  }

  if (err.name === "JsonWebTokenError") {
    return res
      .status(401)
      .json(createErrorResponse(401, "Invalid token", "INVALID_TOKEN"));
  }

  if (err.name === "TokenExpiredError") {
    return res
      .status(401)
      .json(createErrorResponse(401, "Token expired", "TOKEN_EXPIRED"));
  }

  if (err.code === "23505") {
    return res
      .status(409)
      .json(createErrorResponse(409, "Resource already exists", "CONFLICT"));
  }

  if (err.code === "23503") {
    return res
      .status(404)
      .json(createErrorResponse(404, "Referenced resource not found", "NOT_FOUND"));
  }

  return res
    .status(500)
    .json(createErrorResponse(500, "Internal server error", "INTERNAL_SERVER_ERROR"));
};

export const notFound = (req, res) => {
  logger.warn({ url: req.url, method: req.method }, "Endpoint not found");

  return res
    .status(404)
    .json(createErrorResponse(404, "Endpoint not found", "NOT_FOUND"));
};