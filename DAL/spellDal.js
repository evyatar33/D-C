const { database } = require("../data/db");

function getSpellFromDB(name) {

    return new Promise((res, rej) => {

        database.get(
            `SELECT * FROM spells WHERE name = ?`,
            [name],
            function (err, row) {

                if (err) {
                    rej(err);
                } else {
                    res(row);
                }
            }
        );
    });
}

function insertSpell(name, data) {

    return new Promise((res, rej) => {

        database.run(
            `INSERT INTO spells (name, data) VALUES (?, ?)`,
            [name, data],
            function (err) {

                if (err) {
                    rej(err);
                } else {
                    res(this);
                }
            }
        );
    });
}

module.exports = {
    getSpellFromDB,
    insertSpell
};