const { database } = require("../data/db");
function insertNewName(name) {
  const result = new Promise((res, err) => {
    database.run(`INSERT INTO users (name) VALUES (?)`, [name], function (err) {
      if (err) {
        console.log(err);
        err(err);
      } else {
        res(this);
      }
    });
  });
  return result;
}
function checkIfNameExists(name) {
  const result = new Promise((res, err) => {
    database.get(
      `SELECT * FROM users WHERE name = ?`,
      [name],
      function (err, row) {
        if (err) {
          console.log(err);
          err(err);
        } else {
          res(row);
        }
      },
    );
  });
  return result;
}
function getAllNames() {
  const result = new Promise((res, err) => {
    database.all(`SELECT * FROM users`, function (err, rows) {
      if (err) {
        console.log(err);
        err(err);
      } else {
        res(rows);
      }
    });
  });
  return result;
}

function checkIfIdExists(id) {
  const result = new Promise((res, err) => {
    database.get(`SELECT * FROM users WHERE id = ?`, [id], function (err, row) {
      if (err) {
        console.log(err);
        err(err);
      } else {
        res(row);
      }
    });
  });
  return result;
}

function deleteNameById(id) {
  const result = new Promise((res, err) => {
    database.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
      if (err) {
        console.log(err);
        err(err);
      } else {
        res(this);
      }
    });
  });
  return result;
}

function changeRoleById(id, role) {
  const result = new Promise((res, err) => {
    database.run(
      `UPDATE users SET role = ? WHERE id = ?`,
      [role, id],
      function (err) {
        if (err) {
          console.log(err);
          err(err);
        } else {
          res(this);
        }
      },
    );
  });
  return result;
}

module.exports = {
  insertNewName,
  getAllNames,
  checkIfNameExists,
  checkIfIdExists,
  deleteNameById,
  changeRoleById,
};
