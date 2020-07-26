import database from '../config/db';
import returnResult from '../helper/result';

const machineController = {
    getProcessAndMachine(req, res) {
        let query = 'SELECT ind_process.*,(SELECT COUNT(*) FROM op_posts WHERE `ind_process_id`=ind_process.id) AS machenecount FROM ind_process ORDER BY id DESC';
        database.query(query)
            .then(result => returnResult(res, 'Process & machine list', 0, result))
            .catch(err => returnResult(res, 'Oops, error in getting process-machine list!', 1, err));
    },

    getMachineByProcessId(req, res) {
        let query = 'SELECT * FROM op_posts WHERE ind_process_id=? ORDER BY id DESC';
        let processId = req.params.id;
        database.query(query, [processId])
            .then(result => returnResult(res, 'Machine list for process', 0, result))
            .catch(err => returnResult(res, 'Oops, error in getting machine list!', 1, err));
    },



};

export default machineController;
