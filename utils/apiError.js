class apiError extends Error {
  constructor(
    statusCode,
    message = "Something is wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    (this.statusCode = statusCode),
      (this.message = message),
      (this.data = null),
      (this.succcess = false),
      (this.errors = errors);

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}

export default apiError;
