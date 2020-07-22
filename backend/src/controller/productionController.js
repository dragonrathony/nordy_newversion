import database from '../config/db';
import productHelper from '../helper/productHelper';
import returnResult from '../helper/result';

const productionController = {
    add(req, res) {
        let formdata = req.body.raw;
        let ProductCode = formdata['ProductCode'];
        let productHeaderId;
        database.query('SELECT id FROM product_head WHERE product_code=?', [ProductCode])
            .then(result => {
                if (result.length) {
                    // Call update product
                    productHeaderId = result[0].id;
                    productHelper.updateProduct(productHeaderId, req, res);
                } else {
                    // Call add product
                    productHelper.addProduct(req, res);
                }
            })
            .catch(err => {
                console.log('Add product error: ', err);
                returnResult(res, 'Add product error!', 1, err);
            });
    },

    // init product form by product code
    init(req, res) {
        let productCode = req.params.productCode;

        if (productCode === 'null') {
            productHelper.initProductForm(res);
        } else {
            // get product add form using productCode
            database.query('SELECT id, family_name FROM product_head WHERE product_code=?', [productCode])
                .then(producthead => {
                    if (producthead.length) {
                        let oldproductHeadId = producthead[0].id;
                        database.query('SELECT * FROM product_body WHERE product_header_id=?', [oldproductHeadId])
                            .then(productbody => {
                                productHelper.initByProductCode(productbody, res);
                            })
                            .catch(err => returnResult(res, 'select product body error!', 1, err));
                    } else {
                        productHelper.initProductForm(res);
                    }
                })
                .catch(err => returnResult(res, 'Product code error!', 1, err));
        }
    },
};

export default productionController;
