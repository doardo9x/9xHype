require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateJWT, adminOnly } = require('./userPrivate/auth');

const app = express();
const port = process.env.PORT || 3000;

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL');
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Servir arquivos estáticos

// Rota de registro
app.post('/register', async (req, res) => {
    const { email, senha, isAdmin } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const sql = 'INSERT INTO usuarios (email, senha, isAdmin) VALUES (?, ?, ?)';
    connection.query(sql, [email, hashedPassword, isAdmin], (err, results) => {
        if (err) {
            console.error('Erro ao registrar usuário:', err);
            res.status(500).send('Erro ao registrar usuário');
            return;
        }
        res.status(201).send('Usuário registrado com sucesso');
    });
});

// Rota de login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    connection.query(sql, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Email ou senha incorretos');
        }

        const user = results[0];
        const validPass = await bcrypt.compare(senha, user.senha);
        if (!validPass) return res.status(400).send('Email ou senha incorretos');

        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.header('Authorization', token).send('Logado com sucesso');
    });
});

// Rota protegida para adicionar produtos
app.post('/produtos', authenticateJWT, adminOnly, (req, res) => {
    const { nome, descricao, preco, estoque } = req.body;
    const sql = 'INSERT INTO produtos (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)';

    connection.query(sql, [nome, descricao, preco, estoque], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar produto:', err);
            res.status(500).send('Erro ao adicionar produto');
            return;
        }
        res.status(201).send('Produto adicionado com sucesso');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
