import database from '../config/db';
import returnResult from '../helper/result';

const familyController = {
    get(req, res) {
        let query = 'SELECT * FROM family ORDER BY id DESC';
        database.query(query)
            .then(result => returnResult(res, 'Family list', 0, result))
            .catch(err => returnResult(res, 'Oops, error in getting family list!', 1, err));
    },



};

export default familyController;
