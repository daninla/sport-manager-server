export const toCamelCase = (key) =>
  key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

export const camelizeKeys = (value) => {
  if (Array.isArray(value)) return value.map(camelizeKeys);

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        toCamelCase(key),
        camelizeKeys(item),
      ]),
    );
  }

  return value;
};