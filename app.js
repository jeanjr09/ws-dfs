const express = require('express')
const app = express();
const morgan = require('morgan');
app.use('/uploads', express.static('uploads'));
const bodyParser = require('body-parser');

const rotaProdutos = require('./routes/products');
const rotaPedidos = require('./routes/pedidos');
const rotaUsers = require('./routes/users');
const res = require('express/lib/response');

// Utilizando morgan para tratar erros 
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false})); // apenas dados simples
app.use(bodyParser.json()); // json de entrada no body

app.use((req, res, next) => {
    res.header('Acces-Control-Allow-Origin', '*');
    res.header(
        'Acces-Control-Allow-Header',
        'Content-Type',
        'Origin, X-Requrested-With, Content-Type, Accept, Authorization'
        );

        if (req.method === 'OPTIONS') {
            res.header('Acces-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).send({});
        }

        next();
});

app.use('/products', rotaProdutos);
app.use('/pedidos', rotaPedidos);
app.use('/users', rotaUsers);

app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;