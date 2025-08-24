export const handleNotFound = (req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
};

export const errorHandler = (error, request, response, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  response.status(statusCode).json({ error: message });
};
