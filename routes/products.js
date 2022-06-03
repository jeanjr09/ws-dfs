const express = require('express');
const res = require('express/lib/response');
const router = express.Router();

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    res.status(200).send( {
        mensagem: 'Retorna todos os produtos'
    });
});

// INSERE UM PRODUTO
router.post('/', (req, res, next) => {

    const product = {
       name: req.body.name,
       price :req.body.price
    };
    res.status(201).send({
        mensagem: 'Insere um produto',  
        productCreated: product      
    })
});

// RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_product', (req, res, next) => {
    const id = req.params.id_product

    if (id === 'especial') {
        res.status(200).send({
            mensagem: 'Usando o GET de um produto exclusivo',
            id: id
    });
    } else {
        res.status(200).send({
            mensagem: 'Você passou um ID'
        });
    }
   
});

// ALTERA UM PRODUTO
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Produto alterado'        
    })
});

// EXCLUI UM PRODUTO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Produto excluído'        
    })
});

module.exports = router;