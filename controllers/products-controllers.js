
const mysql = require('../mysql');

exports.getProducts = async (req, res, next) => {
    try {
        const result = await mysql.execute("SELECT * FROM products;")
        const response = {
            quantity: result.length,
            products: result.map(prod => {
                return {
                    id_product: prod.id_product,
                    name: prod.name,
                    price: prod.price,
                    imagem_produto: prod.imagem_produto,
                    request: {
                        type: 'GET',
                        description: 'Retorna os detalhes de um produto específico',
                        url: process.env.URL_API + 'products/' + prod.id_product
                    }
                }
        })
    }
        return res.status(200).send(response);
        } catch(error) {
        return res.status(500).send({ error: error});
    }
};


exports.postProducts = async (req, res, next) => {
    try {
        const query = 'INSERT INTO products (name, price, imagem_produto) VALUES (?,?,?)'
        const result = await mysql.execute(query, [
            req.body.name,
            req.body.price,
            req.file.path
        ]);

        const response = {
            mensagem: 'Produto inserido com sucesso',
            productCreated: {
                id_product: result.id_product,
                name: req.body.name,
                price: req.body.price,
                imagem_produto: req.file.path,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os produtos',
                    url: 'http://localhost:8080/products/'
                }
            }
        }
        return res.status(201).send(response);

    } catch (error) {
        return res.status(500).send({ error: error});
    }
};

exports.getUmProduct = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM products WHERE id_product = ?;';
        const result = await mysql.execute(query, [params.id_product]);
        
        if (result.length == 0) {
            return res.status(404).send({
                mensagem: 'Não foi encontrado produto com esse ID'
            })
        }      
        const response = {
          
            product: {
                id_product: result[0].id_product,
                name: result[0].none,
                price: result[0].price,
                imagem_produto: result[0].imagem_produto,
                request: {
                    type: 'GET',
                    description: 'Retorna um produto',
                    url: 'http://localhost:8080/products/'
                }
            }
         }  
            return res.status(200).send(response)

    } catch (error) {
        return res.status(500).send({ error: error});
    };
};

exports.updateProduct = async (req, res, next) => {

    try {
        const query = `UPDATE products
                            SET name = ?,
                                price = ?
                    WHERE id_product = ?`;
        await mysql.execute(query, [
             req.body.name,
             req.body.price,
             req.body.id_product
        ]);
        const response = {
            mensagem: 'Produto atualizado com sucesso',
            productUpdated: {
                id_product: req.body.id_product,
                name: req.body.name,
                price: req.body.price,
                request: {
                    type: 'GET',
                    description: 'Retorna os detalhes de um produto específico',
                    url: 'http://localhost:8080/products/' + req.body.id_product
                }
            }
        }
       return res.status(202).send(response);  

    } catch (error) {
        return res.status(500).send({ error: error});
    }   
};

exports.deleteProduct = async (req, res, next) => {

    try {
        const query = `DELETE FROM products WHERE id_product = ?`;
        await mysql.execute(query, [req.body.id_product]);
        
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

    } catch (error) {
        return res.status(500).send({ error: error });
    }
};