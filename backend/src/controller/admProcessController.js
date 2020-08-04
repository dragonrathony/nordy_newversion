import database from '../config/db';
import returnResult from '../helper/result';

const admProcessController = {
    async get(req, res) {
        let query = 'SELECT * FROM adm_processes';
        await database.query(query)
            .then(result => {
                if (result.length)
                    returnResult(res, 'Success', 0, result);
                else
                    returnResult(res, 'Not found results', 1, result);
            })
            .catch(err => returnResult(res, 'Oops, error in getting adm process!', 1, err));
    },

    async getById(req, res) {
        let processId = req.body.data.id,
            query = 'SELECT * FROM adm_processes WHERE id=?';
        await database.query(query, [processId])
            .then(result => {
                returnResult(res, 'Success', 0, result);
            })
            .catch(err => returnResult(res, 'Oops, error in getting adm process by id!', 1, err));
    },

    async create(req, res) {
        let { processName, processCost } = req.body.data,
            query = 'INSERT INTO adm_processes(name, cost) VALUES(?,?)';

        await database.query(query, [processName, processCost])
            .then(result => {
                returnResult(res, 'Added successfully', 0, result);
            })
            .catch(err => returnResult(res, 'Oops, error in recording adm process!', 1, err));
    },


};

export default admProcessController;
