export function validate(schema) {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (err) {
      res.status(400).json({
        error: "Помилка валідації",
        details: err.issues.map((issue) => ({
          path: issue.path.join(".") || "(объект запроса)",
          message: issue.message,
        })),
      });
    }
  };
}
