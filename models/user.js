const db = require('../db/database');

const User = {
    create: (username, password, name, cpf, telefone, cep, logradouro, bairro, cidade, estado, role, callback) => {
        const sql = 'INSERT INTO user (username, password, name, cpf, telefone, cep, logradouro, bairro, cidade, estado, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const params = [username, password, name, cpf, telefone, cep, logradouro, bairro, cidade, estado, role];
        db.run(sql, params, function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, this.lastID);
        });
    },
    findByUsername: (username, callback) => {
        const sql = 'SELECT * FROM user WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            callback(err, row);
        });
    }
};

module.exports = User;
