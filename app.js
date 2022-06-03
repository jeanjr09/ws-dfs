const express = require('express')
const app = express();

const rotaProdutos = require('./routes/products');
const rotaPedidos = require('./routes/pedidos');

app.use('/products', rotaProdutos);
app.use('/pedidos', rotaPedidos);


module.exports = app;