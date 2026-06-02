const path = require("path");

const isPostgres = Boolean(process.env.DATABASE_URL);
let database;

if (isPostgres) {
  const { Pool } = require("pg");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  let queryQueue = Promise.resolve();

  function convertPlaceholders(sql) {
    let index = 0;
    return sql.replace(/\?/g, function () {
      index++;
      return "$" + index;
    });
  }

  function enqueueQuery(sql, params, callback, mode) {
    queryQueue = queryQueue.then(async function () {
      try {
        const result = await pool.query(convertPlaceholders(sql), params || []);
        if (mode === "get") {
          callback(null, result.rows[0]);
        } else if (mode === "all") {
          callback(null, result.rows);
        } else {
          callback.call({ changes: result.rowCount }, null);
        }
      } catch (error) {
        callback(error);
      }
    });
  }

  database = {
    serialize(callback) {
      callback();
    },
    run(sql, params, callback) {
      if (typeof params === "function") {
        callback = params;
        params = [];
      }
      enqueueQuery(sql, params, callback || function () {}, "run");
    },
    get(sql, params, callback) {
      enqueueQuery(sql, params, callback, "get");
    },
    all(sql, params, callback) {
      if (typeof params === "function") {
        callback = params;
        params = [];
      }
      enqueueQuery(sql, params, callback, "all");
    },
  };
  // On Render/Supabase, DATABASE_URL exists, so the same DAL functions run on PostgreSQL.
} else {
  const sqlite3 = require("sqlite3").verbose();
  const dbPath = path.join(__dirname, "..", "database.db");
  database = new sqlite3.Database(dbPath);
  // Locally, there is no DATABASE_URL, so the project still uses your SQLite database.db file.
}

module.exports = { database, isPostgres };
