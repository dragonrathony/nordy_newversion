import database from '../config/db';
import returnResult from '../helper/result';

const processController = {
    get(req, res) {
        database.query('SELECT * FROM ind_process')
            .then(result => returnResult(res, 'process list', 0, result))
            .catch(err => returnResult(res, 'Oops, error in getting proess list!', 1, err));
    }

};

export default processController;
