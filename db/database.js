const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,  
            username TEXT UNIQUE NOT NULL,  
            password TEXT NOT NULL,  
            cpf TEXT,  
            telefone TEXT,  
            cep TEXT,  
            logradouro TEXT,  
            bairro TEXT,  
            cidade TEXT,  
            estado TEXT,  
            role TEXT NOT NULL  
        )
    `);

    
    db.all("PRAGMA table_info(user)", (err, rows) => {
        if (err) {
            console.error("Erro ao verificar colunas:", err);
            return;
        }

        const columnsToAdd = [
            { name: 'name', type: 'TEXT' },
            { name: 'cpf', type: 'TEXT' },
            { name: 'telefone', type: 'TEXT' },
            { name: 'cidade', type: 'TEXT' },  
            { name: 'estado', type: 'TEXT' }   
        ];

        columnsToAdd.forEach(col => {
            const hasColumn = rows.some(row => row.name === col.name);
            if (!hasColumn) {
                db.run(`ALTER TABLE user ADD COLUMN ${col.name} ${col.type}`, (err) => {
                    if (err) {
                        console.error(`Erro ao adicionar coluna '${col.name}':`, err);
                    } else {
                        console.log(`Coluna '${col.name}' adicionada com sucesso.`);
                    }
                });
            }
        });
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS pet (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            sexo TEXT,
            raca TEXT,
            idade INTEGER,
            alergia TEXT,
            ownerId INTEGER,
            FOREIGN KEY (ownerId) REFERENCES user(id)
        )
    `);

    
    db.all("PRAGMA table_info(pet)", (err, rows) => {
        if (err) {
            console.error("Erro ao verificar colunas na tabela pet:", err);
            return;
        }

        const petColumnsToAdd = [
            { name: 'sexo', type: 'TEXT' },
            { name: 'raca', type: 'TEXT' },
            { name: 'idade', type: 'INTEGER' },
            { name: 'alergia', type: 'TEXT' }
        ];

        petColumnsToAdd.forEach(col => {
            const hasColumn = rows.some(row => row.name === col.name);
            if (!hasColumn) {
                db.run(`ALTER TABLE pet ADD COLUMN ${col.name} ${col.type}`, (err) => {
                    if (err) {
                        console.error(`Erro ao adicionar coluna '${col.name}' na tabela pet:`, err);
                    } else {
                        console.log(`Coluna '${col.name}' adicionada com sucesso na tabela pet.`);
                    }
                });
            }
        });
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS service (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            petId INTEGER,
            ownerId INTEGER,  -- Adicionando o id do dono do pet (ownerId)
            serviceType TEXT NOT NULL,
            status TEXT NOT NULL,
            taxiPet BOOLEAN,  -- Adicionando o campo taxiPet
            data TEXT,  -- Adicionando a data do serviço
            horario TEXT,  -- Adicionando o horário do serviço
            pelagem TEXT,  -- Adicionando o tipo de pelagem
            FOREIGN KEY (petId) REFERENCES pet(id),
            FOREIGN KEY (ownerId) REFERENCES user(id)
        )
    `);

    
    db.all("PRAGMA table_info(service)", (err, rows) => {
        if (err) {
            console.error("Erro ao verificar colunas na tabela service:", err);
            return;
        }

        const serviceColumnsToAdd = [
            { name: 'ownerId', type: 'INTEGER' },
            { name: 'taxiPet', type: 'BOOLEAN' },
            { name: 'data', type: 'TEXT' },
            { name: 'horario', type: 'TEXT' },
            { name: 'pelagem', type: 'TEXT' }
        ];

        serviceColumnsToAdd.forEach(col => {
            const hasColumn = rows.some(row => row.name === col.name);
            if (!hasColumn) {
                db.run(`ALTER TABLE service ADD COLUMN ${col.name} ${col.type}`, (err) => {
                    if (err) {
                        console.error(`Erro ao adicionar coluna '${col.name}' na tabela service:`, err);
                    } else {
                        console.log(`Coluna '${col.name}' adicionada com sucesso na tabela service.`);
                    }
                });
            }
        });
    });

    db.run(`
        INSERT OR IGNORE INTO user (username, password, role)
        VALUES ('admin', 'admin123', 'admin')
    `);
});

module.exports = db;
