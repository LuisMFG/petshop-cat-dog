const db = require('../db/database');

const Service = {
    create: (petId, ownerId, serviceType, taxiPet, data, horario, pelagem, status, callback) => {
        const sql = `
            INSERT INTO service (petId, ownerId, serviceType, taxiPet, data, horario, pelagem, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(sql, [petId, ownerId, serviceType, taxiPet, data, horario, pelagem, status], function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, this.lastID);
        });
    },
    updateStatus: (id, status, callback) => {
        const sql = 'UPDATE service SET status = ? WHERE id = ?';
        db.run(sql, [status, id], function (err) {
            callback(err);
        });
    }
};

module.exports = Service;
