import database from '../config/db';
import productHelper from '../helper/productHelper';

const productionController = {
    add(req, res) {
        let formdata = req.body.raw;
        let ProductCode = formdata['ProductCode'];
        let ProductHeaderID;
        database.query('SELECT Id FROM product_head WHERE product_code=?', [ProductCode])
            .then(result => {
                if (result.length) {
                    // Call update product
                    ProductHeaderID = result[0].Id;
                    productHelper.updateProduct(ProductHeaderID, req, res);
                } else {
                    // Call add product
                    productHelper.addProduct(req, res);
                }
            })
            .catch(err => {
                console.log('Error: ', err)
            });
    },

    // init product form by product code
    async init(req, res) {
        let productCode = req.params.productCode;

        if (productCode === 'null') {
            console.log('product code is null')
            productHelper.initProductForm(res);
        } else {
            // get product add form using productCode
            console.log('productcode is not null')
            database.query('SELECT id, family_name FROM product_head WHERE product_code=?', [productCode])
                .then(producthead => {
                    if (producthead.length) {
                        let oldproductHeadId = producthead[0].id;
                        database.query('SELECT * FROM product_body WHERE product_header_id=?', [oldproductHeadId])
                            .then(productbody => {
                                productHelper.initByProductCode(productbody, res);
                            })
                            .catch(err => {
                                console.log('select product body error', err)
                            });
                    } else {
                        productHelper.initProductForm();
                    }
                })
                .catch(err => {
                    console.log('err', err)
                });
        }
    },
};

export default productionController;
