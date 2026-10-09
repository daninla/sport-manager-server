export function validate(schema) {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err) {
      return res.status(400).json({
        error: "Помилка валідації",
        details: err.issues ? err.issues.map((i) => i.message) : err.message,
      });
    }
  };
}