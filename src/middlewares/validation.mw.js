export function validate(schema) {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (err) {
      res.status(400).json("Помилка валідації", {
        error: err.issues.map((issue) => issue.message).join(", "),
      });
    }
  };
}
