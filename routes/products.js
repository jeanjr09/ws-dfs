const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');
const ProductControllers = require('../controllers/products-controllers');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname );
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
    
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 15277209
    },
    fileFilter: fileFilter
 });

// RETORNA TODOS OS PRODUTOS
router.get('/', ProductControllers.getProducts);

// INSERE UM PRODUTO
router.post('/', 
login.obrigatorio, 
upload.single('imagem_produto'), 
ProductControllers.postProducts);

// RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_product', 
ProductControllers.getUmProduct);

// ALTERA UM PRODUTO
router.patch('/', 
login.obrigatorio, 
ProductControllers.updateProduct);

// EXCLUI UM PRODUTO
router.delete('/', 
login.obrigatorio, 
ProductControllers.deleteProduct);

module.exports = router;