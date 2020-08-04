import database from '../config/db';
import returnResult from '../helper/result';

const admProcessController = {
    async get(req, res) {
        let query = 'SELECT * FROM adm_processes';
        await database.query(query).then(result => {
            if (result.length)
                returnResult(res, 'Success', 0, result);
            else
                returnResult(res, 'Not found results', 1, result);
        }).catch(err => returnResult(res, 'Oops, error in getting adm process!', 1, err));
    },



};

export default admProcessController;
