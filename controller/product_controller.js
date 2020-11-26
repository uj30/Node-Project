let brandModel = require('../model/brand_model');
let jwt = require('jsonwebtoken');
let config = require('../config/config');

exports.getProducts = function (req, res) {
    let token = req.headers['x-access-token'];  //For Authentication

    if (!token)
        return res.status(401).json({ msg: 'No token provided.' });

    jwt.verify(token, config.secret, function (err) {
        if (err)
            return res.status(500).json({ msg: 'Failed to authenticate token.' });

        exports.getProductItemList(req, res);  //Fetching the list 
    });
};

exports.getProductItemList = function (req, res) {
    let query = [
        {
            $lookup: {
                from: "products",
                localField: "name",
                foreignField: "sku",
                as: "details"
            }
        }
    ];

    //For Filters
    if (req.query.category) {
        query.push({
            $match: { "details": { $elemMatch: { "category": req.query.category } } }
        });
    }

    if (req.query.name) {
        query.push({
            $match: { "details": { $elemMatch: { "name": req.query.name } }, name: req.query.name }
        });
    }

    query.push({
        $match: {
            "details": { $elemMatch: { "isDeleted": req.query.status || 0 } }, isDeleted: req.query.status || 0
        }
    });

    //For Changing the column name
    query.push({
        $unwind: "$details",
        $project: {
            'product_id': '$_id',
            'product_name': '$name',
            'product_sku': '$details.sku',
            'product_price': '$details.price',
            'product_mrp_price': '$details.mrp_price',
            'product_image': '$details.image',
            'product_brand_image': '$image',
            'product_category': '$details.category'
        }
    });

    // For Pagination
    let pageNo = req.query.pageNo || 0; //Assuming from pageNo 0
    query.push({
        '$facet': {
            metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
            data: [{ $skip: pageNo * 10 }, { $limit: 10 }]
        }
    });

    brandModel.aggregate(query).then(function (modifyData) {
        res.status(200).json({
            msg: "data found",
            data: modifyData.data
        });
    });
}