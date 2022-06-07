const express = require('express');
const res = require('express/lib/response');
const router = express.Router();

const PedidosControllers = require('../controllers/pedidos-controllers');

// RETORNA TODOS OS PEDIDOS
router.get('/', PedidosControllers.getPedidos);

// INSERE UM PEDIDO
router.post('/', PedidosControllers.postPedidos);

// RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', PedidosControllers.getUmPedido);

// EXCLUI PEDIDO
router.delete('/', PedidosControllers.deletePedido);

module.exports = router;