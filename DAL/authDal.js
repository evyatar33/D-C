const { database } = require("../data/db");

function createUser(username, password) {
  return new Promise((resolve, reject) => {
    const role = username === "admin" ? "admin" : "user";
    // New accounts are normal users, except username "admin" which gets admin permissions.
    database.run(
      `INSERT INTO site_users (username, password, role) VALUES (?, ?, ?)`,
      [username, password, role],
      function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      },
    );
  });
}

function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    database.get(
      `SELECT * FROM site_users WHERE username = ?`,
      [username],
      function (error, row) {
        if (error) {
          reject(error);
        } else {
          resolve(row);
        }
      },
    );
  });
}

function updateUserPassword(id, password) {
  return new Promise((resolve, reject) => {
    database.run(
      `UPDATE site_users SET password = ? WHERE id = ?`,
      [password, id],
      function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      },
    );
  });
}

function getAllUsers() {
  return new Promise((resolve, reject) => {
    database.all(
      `SELECT id, username, role FROM site_users ORDER BY id`,
      function (error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      },
    );
  });
}

function deleteUserById(id) {
  return new Promise((resolve, reject) => {
    database.run(`DELETE FROM site_users WHERE id = ?`, [id], function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(this);
      }
    });
  });
}

module.exports = {
  createUser,
  findUserByUsername,
  updateUserPassword,
  getAllUsers,
  deleteUserById,
};
