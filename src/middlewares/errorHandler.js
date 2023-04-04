export function errorHandler(err, req, res, next) {
  // Check if the error has a status code, otherwise set it to 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;

  // Set the response status code and send the error message
  res.status(statusCode).send({
    error: {
      status: statusCode,
      message: err.message,
    },
  });
}
