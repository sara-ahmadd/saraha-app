export const validate = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.query, ...req.params };
    const validation = schema.validate(data, { abortEarly: false });
    if (validation.error) {
      return next(
        new Error(
          validation.error.details.map((obj) => obj.message),
          { cause: 400 }
        )
      );
    }
    return next();
  };
};
