const express = require('express');
const User = require('../models/user');
const Pet = require('../models/pet');
const Service = require('../models/service');
const router = express.Router();
const db = require('../db/database');

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.status(401).send('Unauthorized');
}

// Rota de cadastro de usuário
router.post('/register', (req, res) => {
    const { username, password, name, cpf, telefone, cep, logradouro, bairro, cidade, estado } = req.body;
    User.create(username, password, name, cpf, telefone, cep, logradouro, bairro, cidade, estado, 'user', (err, userId) => {
        if (err) {
            console.error('Erro ao criar usuário:', err);
            return res.status(500).json({ error: 'Erro ao criar usuário' });
        }
        res.status(201).json({ userId });
    });
});

// Rota de login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findByUsername(username, (err, user) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuário' });
        }

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        req.session.user = user;
        res.json({ success: true, role: user.role });
    });
});

// Rota para cadastrar um animal
router.post('/pets', isAuthenticated, (req, res) => {
    const { name, type, sexo, raca, idade, alergia } = req.body;
    const ownerId = req.session.user.id;

    Pet.create(name, type, sexo, raca, idade, alergia, ownerId, (err, petId) => {
        if (err) {
            console.error('Erro ao criar pet:', err);
            return res.status(500).json({ error: 'Erro ao criar pet' });
        }
        res.status(201).json({ petId });
    });
});

// Rota para solicitar um serviço
router.post('/services', isAuthenticated, (req, res) => {
    const { petId, serviceType, taxiPet, data, horario, pelagem } = req.body;
    const ownerId = req.session.user.id;

    Service.create(petId, ownerId, serviceType, taxiPet, data, horario, pelagem, 'pendente', (err, serviceId) => {
        if (err) {
            console.error('Erro ao criar serviço:', err);
            return res.status(500).json({ error: 'Erro ao criar serviço' });
        }
        res.status(201).json({ serviceId });
    });
});

// Rota para obter dados de administração
router.get('/admin/data', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    const sql = `
        SELECT u.username, p.name AS pet, p.type AS type, p.alergia AS alergia, s.serviceType, s.status, u.telefone, s.horario, s.data, s.pelagem, s.id AS serviceId
        FROM service s
        JOIN pet p ON s.petId = p.id
        JOIN user u ON p.ownerId = u.id
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao obter dados de administração' });
        }
        res.json(rows);
    });
});

// Rota para atualizar o status do serviço
router.put('/services/:id/status', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const sql = `UPDATE service SET status = ? WHERE id = ?`;

    db.run(sql, [status, id], function(err) {
        if (err) {
            console.error('Erro ao atualizar status:', err);
            return res.status(500).json({ error: 'Erro ao atualizar status' });
        }
        res.json({ message: 'Status atualizado com sucesso' });
    });
});

// Rota para obter os pets do usuário logado
router.get('/user-pets', isAuthenticated, (req, res) => {
    const ownerId = req.session.user.id;
    const sql = 'SELECT id, name FROM pet WHERE ownerId = ?';

    db.all(sql, [ownerId], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar pets:', err);
            return res.status(500).json({ error: 'Erro ao buscar pets' });
        }
        res.json(rows);
    });
});

// Rota para obter dados de um serviço específico
router.get('/services/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM service WHERE id = ?';

    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Erro ao obter dados do serviço:', err);
            return res.status(500).json({ error: 'Erro ao obter dados do serviço' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }
        res.json(row);
    });
});

// Rota para atualizar um serviço específico
router.put('/services/:id', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    const { id } = req.params;
    const { petId, serviceType, taxiPet, data, horario, pelagem } = req.body;

    const sql = `
        UPDATE service
        SET petId = ?, serviceType = ?, taxiPet = ?, data = ?, horario = ?, pelagem = ?
        WHERE id = ?
    `;

    db.run(sql, [petId, serviceType, taxiPet, data, horario, pelagem, id], function(err) {
        if (err) {
            console.error('Erro ao atualizar serviço:', err);
            return res.status(500).json({ error: 'Erro ao atualizar serviço' });
        }
        res.json({ message: 'Serviço atualizado com sucesso' });
    });
});

// Rota para excluir um serviço específico
router.delete('/services/:id', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    const { id } = req.params;

    const sql = `DELETE FROM service WHERE id = ?`;

    db.run(sql, [id], function(err) {
        if (err) {
            console.error('Erro ao excluir serviço:', err);
            return res.status(500).json({ error: 'Erro ao excluir serviço' });
        }
        res.json({ message: 'Serviço excluído com sucesso' });
    });
});

module.exports = router;
