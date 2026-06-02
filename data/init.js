const { database, isPostgres } = require("./db");

function databaseInit() {
  database.serialize(() => {
    const idColumn = isPostgres ? "SERIAL PRIMARY KEY" : "INTEGER PRIMARY KEY AUTOINCREMENT";
    // Render/Supabase uses PostgreSQL SERIAL ids; local SQLite keeps AUTOINCREMENT ids.

    database.run(`CREATE TABLE IF NOT EXISTS spells (
      id ${idColumn},
      name TEXT UNIQUE,
      data TEXT
  )`);
    database.run(`CREATE TABLE IF NOT EXISTS site_users (
      id ${idColumn},
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    )`);
    // Added site_users so signup/login data is saved in SQL instead of browser localStorage.
    database.run(`ALTER TABLE site_users ADD COLUMN role TEXT DEFAULT 'user'`, function () {});
    // Adds role to older databases too, so existing users still work after adding admin features.
    database.run(`UPDATE site_users SET role = 'admin' WHERE username = 'admin'`);
    // Makes the username "admin" an admin account, so only that user sees and uses admin tools.
    database.run(`CREATE TABLE IF NOT EXISTS users (
      id ${idColumn},
      name TEXT UNIQUE,
      role TEXT DEFAULT 'user'
    )`);
    // Creates the older users demo table on Render too, so submitRouter/usersDal still have a table.
  });
  // 1: צור טבלה אם טבלת המשתמשים לא קיימת
  // 2: עמודת המזהה - מוגדרת כמספר, מוגדרת כמפתח ראשי, הגדל באופן אוטומטי
  // 3: עמודת השם - מוגדרת כטקסט, לא יכולה להיות ריקה
}

module.exports = { databaseInit };
