import { readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { DataTypes, Sequelize } from "sequelize";
import databaseConfig from "../postgresConfig.js";

const modelsDirectory = fileURLToPath(new URL(".", import.meta.url));
const config = databaseConfig["development"];
const indexFile = basename(fileURLToPath(import.meta.url));
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);
const db = {};

// Загружаем каждый файл модели из этой папки, кроме самого index.js.
const modelFiles = readdirSync(modelsDirectory).filter(
  (file) => file.endsWith(".js") && file !== indexFile,
);

for (const file of modelFiles) {
  // Динамический import нужен, потому что имя каждого файла известно только при обходе папки.
  const { default: defineModel } = await import(
    pathToFileURL(join(modelsDirectory, file)).href
  );
  // Функция из файла модели создаёт Sequelize-модель и возвращает её объект.
  const model = defineModel(sequelize, DataTypes);
  db[model.name] = model;
}

// Связи настраиваются после загрузки всех моделей, чтобы каждая была доступна в db.
Object.values(db).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { sequelize };
export default db;