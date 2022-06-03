const express = require('express')
const app = express();
const morgan = require('morgan');

const rotaProdutos = require('./routes/products');
const rotaPedidos = require('./routes/pedidos');
const res = require('express/lib/response');

// Utilizando morgan para tratar erros 
app.use(morgan('dev'));

app.use('/products', rotaProdutos);
app.use('/pedidos', rotaPedidos);

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