const globalError = (err, req, res, next) => {

  console.error(err);
  const statusCode = err.cause || 500;

  // Return the error response
  return res.status(statusCode).json({
    message: err.message,
    status: statusCode,
  });
};

export default globalError;
