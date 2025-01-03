export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      //check if error is object and has keys
      if (Object.keys(error).length === 0) {
        return next(new Error(error.message));
      }
      return next(error);
    });
  };
};
