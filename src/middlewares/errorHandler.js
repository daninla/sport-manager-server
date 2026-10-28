export const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Error:", err);

  switch (err.code) {
    case "23505":
      return res.status(409).json({
        error: "Conflict",
        message:
          "Запис із такими даними вже існує (порушення UNIQUE constraint)",
      });
    case "23503":
      return res.status(400).json({
        error: "Bad Request",
        message: "Порушення зовнішнього ключа (Foreign Key Constraint)",
      });
    case "22P02":
      return res.status(400).json({
        error: "Bad Request",
        message: "Некоректний тип даних в запиті",
      });
    default:
      return res.status(err.status || 500).json({
        error: err.name || "Internal Server Error",
        message: err.message || "Щось пішло не так на сервері",
      });
  }
};
