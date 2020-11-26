let router = require('express').Router();
let user = require('../controller/product_controller.js');

router.get('/', function (req, res) {
    res.json({
        status: 'API Works Fine',
        message: 'Welcome to Product API'
    });
});

router.route('/product')
    .get(user.getProducts);

module.exports = router;