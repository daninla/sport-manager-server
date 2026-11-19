export const validateBySchema = schema => {
  return async (req, res, next) => {
    try {
      const validatedBody = await schema.parse(req.body);
      req.body = validatedBody;
      next();
    } catch (error) {
      next(error);
    }
  };
};
