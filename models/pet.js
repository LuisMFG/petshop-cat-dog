const db = require('../db/database');
const Pet = {
    create: (name, type, sexo, raca, idade, alergia, ownerId, callback) => {
        if (typeof callback !== 'function') {
            throw new TypeError('O argumento callback deve ser uma função');
        }

        const sql = `
            INSERT INTO pet (name, type, sexo, raca, idade, alergia, ownerId) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(sql, [name, type, sexo, raca, idade, alergia, ownerId], function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, this.lastID);
        });
    }
};

module.exports = Pet;
