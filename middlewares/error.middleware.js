const errorMiddleware = (err, req, res, next) => {
  console.error(err); // Log the error for server-side debugging

  // Check if the response has already been sent
  if (res.headersSent) {
    return next(err);
  }

  // Send an error response to the client
  res.status(500).json({
    message: "An unexpected error occurred",
    error: err.message,
  });
};

export default errorMiddleware;
