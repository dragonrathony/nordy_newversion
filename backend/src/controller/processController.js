import database from '../config/db';
import returnResult from '../helper/result';

const processController = {
    get(req, res) {
        database.query('SELECT * FROM ind_process')
            .then(result => returnResult(res, 'process list', 0, result))
            .catch(err => returnResult(res, 'Oops, error in getting proess list!', 1, err));
    },

    create(req, res) {
        let processName = req.body.raw.sections[0].MachineName;
        let section = req.body.raw;
        section = JSON.stringify(section);

        database.query('SELECT * FROM ind_process WHERE process_name=?', [processName])
            .then(result => {
                if (result.length > 0) {
                    returnResult(res, 'Process name already exist!', 1, result);
                } else {
                    database.query('INSERT INTO ind_process(process_name, extra) VALUES(?,?)', [processName, section])
                        .then(result => returnResult(res, 'Added Successfully!', 0, result))
                        .catch(err => returnResult(res, 'Oops, Error in recording process!', 1, err));
                }
            })
            .catch(err => returnResult(res, 'Oops, Error in getting process!', 1, err));
    }

};

export default processController;
