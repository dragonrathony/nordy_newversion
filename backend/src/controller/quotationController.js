import database from '../config/db';
import returnResult from '../helper/result';

const quotationController = {
    async quotation(req, res) {
        let code = req.body.data.code,
            quantity = req.body.data.quantity,
            query = `SELECT product_head.id AS phid, family.*
            FROM product_head
            LEFT JOIN family
            ON product_head.family_name=family.family_name
            WHERE product_code=?
            ORDER BY process_order ASC`,
            process = {},
            admProcesses,
            minimumcost = 0,
            meachneDetails = {},
            timeLimit = 0,
            MQuality = {},
            returnreslt = {};

        if (!code || !quantity) {
            returnResult(res, 'Error! product code or quantity is missing!', 1, []);
            return;
        }

        database.query(query, [code]).then(result => {
            returnResult(res, 'Quotation API Test successfully', 0, result);

        }).catch(err => returnResult(res, 'Error in getting product', 1, err));


    },


};

export default quotationController;
