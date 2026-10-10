# Database Connection Guide

Руководство по подключению к базе данных PostgreSQL (Neon).

## Параметры подключения

| Параметр | Значение |
| :--- | :--- |
| **Driver / Type** | PostgreSQL |
| **Host** | `ep-lucky-art-b41ufcl9-pooler.c-6.us-east-2.aws.neon.tech` |
| **Port** | `5432` |
| **Database** | `neondb` |
| **Username** | `neondb_owner` |
| **Password** | `npg_TIpPXcift0R4` |

---

## 1. DBeaver

1. Откройте **DBeaver** и нажмите **New Database Connection** (иконка вилки с плюсом).
2. Выберите тип базы **PostgreSQL** → **Next**.
3. Заполните поля на вкладке **Main**:
   - **Host:** `ep-lucky-art-b41ufcl9-pooler.c-6.us-east-2.aws.neon.tech`
   - **Port:** `5432`
   - **Database:** `neondb`
   - **Username:** `neondb_owner`
   - **Password:** `npg_TIpPXcift0R4`
4. Нажмите **Test Connection...** (драйвер согласует SSL автоматически).
5. Нажмите **Finish**.

---

## 2. VS Code (SQLTools)

1. Откройте вкладку **SQLTools** на панели VS Code.
2. Нажмите **Add New Connection** и выберите **PostgreSQL**.
3. Заполните поля:
   - **Connection name:** `Neon DB`
   - **Connect using:** `Server and Port`
   - **Server Address:** `ep-lucky-art-b41ufcl9-pooler.c-6.us-east-2.aws.neon.tech`
   - **Port:** `5432`
   - **Database:** `neondb`
   - **Username:** `neondb_owner`
   - **Password:** `npg_TIpPXcift0R4`
   - **Use SSL:** включите (SQLTools в VS Code в отличие от DBeaver часто требует явного флага SSL).
4. Нажмите **Test Connection**, затем **Save Connection**.

---

## Connection String (.env)

```env
DATABASE_URL=postgresql://neondb_owner:npg_TIpPXcift0R4@ep-lucky-art-b41ufcl9-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
