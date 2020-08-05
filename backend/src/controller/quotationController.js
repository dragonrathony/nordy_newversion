import database from '../config/db';
import returnResult from '../helper/result';

const quotationController = {
    async get(req, res) {
        returnResult(res, 'Quotation API test successfully', 0, []);
    },


};

export default quotationController;
