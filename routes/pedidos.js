const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
        mysql.getConnection((error, conn) => {
            if (error) { return res.status(500).send({ error: error }) }
            conn.query(
                'SELECT * FROM pedidos',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantity: result.length,
                    pedidos: result.map(pedido => {
                        return {
                            id_pedido: pedido.id_pedido,
                            id_product: pedido.id_product,
                            quantity: pedido.quantity,
                            request: {
                                type: 'GET',
                                description: 'Retorna os detalhes de um produto específico',
                                url: 'http://localhost:8080/products/' + pedido.id_pedido
                            }
                        }
                    })
                }
                return res.status(200).send(response);
             }
        )
    });
});

// INSERE UM PEDIDO
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM products WHERE id_product = ?', [req.body.id_product], 
        (error, result, field) => {
            if (error) { return res.status(500).send({ error: error }) }
            if (result.length == 0) {
                return res.status(404).send({
                    mensagem: 'Produto não encontrado'
                })
            } 
            conn.query(
                'INSERT INTO pedidos (id_product, quantity) VALUES (?,?)',
                [req.body.id_product, req.body.quantity],
                (error, result, field) => {
                    conn.release();
                    if (error) { return res.status(500).send({ error: error }) }
                    const response = {
                        mensagem: 'Pedido inserido com sucesso',
                        orderCreated: {
                            id_pedido: result.id_pedido,
                            id_product: req.body.id_product,
                            quantity: req.body.quantity,
                            request: {
                                type: 'GET',
                                description: 'Retorna todos os pedidos',
                                url: 'http://localhost:8080/pedidos/'
                            }
                        }
                    }
                   return res.status(201).send(response);
            }       
        )    
        })
    });
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO pedidos (id_product, quantity) VALUES (?,?)',
            [req.body.id_product, req.body.quantity],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Pedido inserido com sucesso',
                    orderCreated: {
                        id_pedido: result.id_pedido,
                        id_product: req.body.id_product,
                        quantity: req.body.quantity,
                        request: {
                            type: 'GET',
                            description: 'Retorna todos os pedidos',
                            url: 'http://localhost:8080/pedidos/'
                        }
                    }
                }
               return res.status(201).send(response);
        }       
    ) 
    });
});

// RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM pedidos WHERE id_product = ?;',
        (req.params.id_pedido),
        (error, result, fields) => {
            if (error) { return res.status(500).send({ error: error }) }          
            if (result.length == 0) {
                return res.status(404).send({
                    mensagem: 'Não foi encontrado pedido com esse ID'
                })
            }         
            const response = {
              
                pedido: {
                    id_pedido: result[0].id_pedido,
                    id_product: result[0].id_product,
                    quantity: result[0].quantity,
                    request: {
                        type: 'GET',
                        description: 'Retorna todos os pedidos',
                        url: 'http://localhost:8080/pedidos/'
                    }
                }
             }  
                return res.status(200).send(response)
            }
        )
    });
});

// EXCLUI PEDIDO
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM pedidos WHERE id_pedidos = ?`, [req.body.id_pedido],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Pedido removido com sucesso',
                    request: {
                        type: 'POST',
                        description: 'Insere um pedido',
                        url: 'http://localhost:8080/pedidos',
                        body: {
                            id_product: 'Number',
                            quantity: 'Number'
                        }
                    }
                }
                return res.status(202).send(response);   
        }       
    ) 
    });
});

module.exports = router;