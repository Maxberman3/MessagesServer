const morgan = require("morgan");

morgan.token("data", req => {
  let data = req.body;
  return JSON.stringify(data);
});

const morganLogger = () => {
  return morgan(
    ":method :url :status :res[content-length] - :response-time ms :data"
  );
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: "unknown endpoint"});
};

const errorHandler = (error, request, response, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(error);
  }

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({error: "malformatted id"});
  } else if (error.name === "ValidationError") {
    return response.status(400).json({error: error.message});
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({error: "invalid token"});
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
  }
  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  morganLogger
};
