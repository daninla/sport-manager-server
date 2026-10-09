export const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Error:", err);

  switch (err.code) {
    case "23505": // unique_violation
      return res.status(409).json({
        error: "Conflict",
        message: "Запис із такими даними вже існує (порушення UNIQUE constraint)",
        detail: err.detail,
      });

    case "23503": // foreign_key_violation
      return res.status(400).json({
        error: "Bad Request",
        message: "Порушення зовнішнього ключа (Foreign Key Constraint)",
        detail: err.detail,
      });

    case "23502": // not_null_violation
      return res.status(400).json({
        error: "Bad Request",
        message: `Поле не може бути порожнім: ${err.column || "відсутнє обов'язкове поле"}`,
      });

    case "22P02": // invalid_text_representation
      return res.status(400).json({
        error: "Bad Request",
        message: "Некоректний тип даних у запиті (очікувалось число або валідний формат)",
      });

    default:
      break;
  }

  // Якщо помилка прийшла від некоректного JSON у тілі запиту
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Некоректний синтаксис JSON у тілі запиту",
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: err.name || "Internal Server Error",
    message: err.message || "Щось пішло не так на сервері",
  });
};