export const validateRequest = (schema, dataLocation) => (req, res, next) => {
  const { error } = schema.validate(req[dataLocation]);
  if (error) return res.status(400).json({ message: error.message });

  next();
};
