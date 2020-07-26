import database from '../config/db';
import returnResult from '../helper/result';

const machineController = {
    get(req, res) {
        let query = 'SELECT ind_process.*,(SELECT COUNT(*) FROM op_posts WHERE `ind_process_id`=ind_process.id) AS machenecount FROM ind_process ORDER BY id DESC';
        database.query(query)
            .then(result => returnResult(res, 'machine list', 0, result))
            .catch(err => returnResult(res, 'Oops, error in getting machine list!', 1, err));
    },



};

export default machineController;
