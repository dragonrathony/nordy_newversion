import database from '../config/db';
import returnResult from '../helper/result';

const processController = {
    get(req, res) {
        database.query('SELECT * FROM ind_process')
            .then(result => returnResult(res, 'process list', 0, result))
            .catch(err => returnResult(res, 'Oops, error in getting proess list!', 1, err));
    },

    getById(req, res) {
        database.query('SELECT * FROM ind_process WHERE id=?', [req.params.id])
            .then(result => {
                if (result.length)
                    returnResult(res, 'Success!', 0, result);
                else
                    returnResult(res, 'Oops, process doesn not exist!', 1, result);
            })
            .catch(err => returnResult(res, 'Oops, there is error in seleting process!', 1, err));
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
    },

    update(req, res) {
        let processName = req.body.raw.sections[0].MachineName;
        let oldId = req.body.raw.sections[0].oldId;
        let section = req.body.raw;
        // Get Shift Values
        let shiftA = section.sections[0].ShiftA;
        let shiftB = section.sections[0].ShiftB;
        let shiftC = section.sections[0].ShiftC;
        let shiftD = section.sections[0].ShiftD;
        let shiftE = section.sections[0].ShiftE;
        // Remove Shift Values from section
        delete section.sections[0]['ShiftA']
        delete section.sections[0]['ShiftB']
        delete section.sections[0]['ShiftC']
        delete section.sections[0]['ShiftD']
        delete section.sections[0]['ShiftE']
        section = JSON.stringify(section);

        database.query('SELECT * FROM ind_process WHERE process_name=? AND id<>?', [processName, oldId])
            .then(result => {
                if (result.length > 0) {
                    returnResult(res, 'Oops, process name is already exist!', 1, result);
                } else {
                    let query = 'UPDATE ind_process SET process_name=?, extra=?, shift_a=?, shift_b=?, shift_c=?, shift_d=?, shift_e=? WHERE id=?';
                    database.query(query, [processName, section, shiftA, shiftB, shiftC, shiftD, shiftE, oldId])
                        .then(result => {
                            returnResult(res, 'Updated Successfully!', 0, result);
                        })
                        .catch(err => returnResult(res, 'Oops, Error in updating process!', 1, err));
                }
            })
            .catch(err => returnResult(res, 'Oops, Error in checking process name exist or not!', 1, err));
    }


};

export default processController;
