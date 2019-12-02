const express = require('express');
const users = require('./users.js');
const router = express.Router(); //variavel ara definir rotas do login

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
})

router.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/cadastro.html');
})

router.get('/paginaGame', (req, res) =>{
    res.sendFile(__dirname + '/bomberman2.html');
})

router.post('/cadastrar', async (req, res) => {
    const usuario_existe = await users.findOne({
        nome: req.body.nome_login
    });

    if(usuario_existe)
    {
        res.redirect('/login/paginaGame')
    }
});

router.post('/register', async (req, res) => {
    const usuario = await users.findOne({
        email: req.body.email
    });
    if(usuario)
    {
        return res.redirect("/login");
    }

    const newUser =  await users.create(req.body);
    res.redirect('/login');
})

module.exports = router;

