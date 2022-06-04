const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM products',
        (error, result, fields) => {
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
                quantity: result.length,
                products: result.map(prod => {
                    return {
                        id_products: prod.id_products,
                        name: prod.name,
                        price: prod.price,
                        request: {
                            type: 'GET',
                            description: 'Retorna os detalhes de um produto específico',
                            url: 'http://localhost:8080/products/' + prod.id_products
                        }
                    }
                })
            }
            return res.status(200).send(response);
            }
        )
    });
});

// INSERE UM PRODUTO
router.post('/', (req, res, next) => {

    const product = {
       name: req.body.name,
       price :req.body.price
    };

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO products (name, price) VALUES (?,?)',
            [req.body.name, req.body.price],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    productCreated: {
                        id_products: result.id_products,
                        name: req.body.name,
                        price: req.body.price,
                        request: {
                            type: 'GET',
                            description: 'Retorna todos os produtos',
                            url: 'http://localhost:8080/products/'
                        }
                    }
                }
               return res.status(201).send(response);
        }       
    ) 
    });
});

// RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_products', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM products WHERE id_products = ?;',
        (req.params.id_products),
        (error, result, fields) => {
            if (error) { return res.status(500).send({ error: error }) }
            
            if (result.length == 0) {
                return res.status(404).send({
                    mensagem: 'Não foi encontrado produto com esse ID'
                })
            }
            
            const response = {
              
                product: {
                    id_products: result[0].id_products,
                    name: result[0].none,
                    price: result[0].price,
                    request: {
                        type: 'GET',
                        description: 'Retorna um produto',
                        url: 'http://localhost:8080/products/'
                    }
                }
             }  
                return res.status(200).send(response)
            }
        )
    });
});

// ALTERA UM PRODUTO
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE products
                SET name = ?,
                    price = ?
            WHERE id_products = ?`,

            [req.body.name,
             req.body.price,
             req.body.id_products],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto atualizado com sucesso',
                    productUpdated: {
                        id_products: req.body.id_products,
                        name: req.body.name,
                        price: req.body.price,
                        request: {
                            type: 'GET',
                            description: 'Retorna os detalhes de um produto específico',
                            url: 'http://localhost:8080/products/' + req.body.id_products
                        }
                    }
                }
               return res.status(202).send(response);    
            })               
    });
});

// EXCLUI UM PRODUTO
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM products WHERE id_products = ?`, [req.body.id_products],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        type: 'POST',
                        description: 'Insere um produto',
                        url: 'http://localhost:8080/products',
                        body: {
                            name: 'String',
                            price: 'Number'
                        }
                    }
                }
                return res.status(202).send(response);   
        }       
    ) 
    });

});

module.exports = router;