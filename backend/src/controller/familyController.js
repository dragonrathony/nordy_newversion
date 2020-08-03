import database from '../config/db';
import returnResult from '../helper/result';

const familyController = {
    get(req, res) {
        let query = 'SELECT * FROM family ORDER BY id DESC';
        database.query(query)
            .then(result => returnResult(res, 'Family list', 0, result))
            .catch(err => returnResult(res, 'Oops, error in getting family list!', 1, err));
    },


    getById(req, res) {
        let id = req.params.id;
        let query = 'SELECT family.*, ind_process.process_name FROM family LEFT JOIN ind_process ON ind_process.id=family.process_id  WHERE family_name=? ORDER BY process_order ASC';
        database.query(query, [id]).then(result => {
            if (result.length)
                returnResult(res, 'Success', 0, result);
            else
                returnResult(res, 'No record found!', 1, []);
        });
    },


    create(req, res) {
        let familyName = req.body.raw.FamilyName;
        let familyProcess = req.body.raw.familyProcess;

        let checkFamilyNameExistQuery = 'SELECT * FROM family WHERE family_name=?';
        let getProcessQuery = 'SELECT * FROM ind_process';
        let insertFamilyQuery = 'INSERT INTO family(family_name, process_id, process_order) VALUES(?,?,?)';

        database.query(checkFamilyNameExistQuery, [familyName])
            .then(result => {
                if (result.length > 0) {
                    returnResult(res, 'Family name already exit', 1, result);
                } else {
                    //find id of process
                    database.query(getProcessQuery)
                        .then(processes => {
                            if (processes.length === 0) {
                                returnResult(res, 'Process does not exist, please add process!', 0, processes);
                            } else {
                                processes.forEach(process => {
                                    //get id of process
                                    let processOrder = 0;
                                    familyProcess.forEach(familyProcessElement => {
                                        if (familyProcessElement == process.process_name) {
                                            processOrder = familyProcess.indexOf(process.process_name);
                                            processOrder += 1;
                                            database.query(insertFamilyQuery, [familyName, process.id, processOrder])
                                                .then(() => { })
                                                .catch(err => returnResult(res, 'Oops, error in recording family process!', 1, err));
                                        }
                                    });
                                });
                                returnResult(res, 'Added Successfully', 0, []);
                            }
                        })
                        .catch(err => returnResult(res, 'Oops, error in getting process list!', 1, err));
                }
            })
            .catch(err => returnResult(res, 'Oops, error in checking family name exist!', 1, err));
    },


    update(req, res) {
        let familyName = req.body.raw.FamilyName,
            familyProcess = req.body.raw.familyProcess,
            oldFamilName = req.body.raw.oldFamilName;

        let checkFamilyNameExistQuery = 'SELECT * FROM family WHERE family_name=?',
            getProcessQuery = 'SELECT * FROM ind_process',
            deleteFamilyQuery = 'DELETE FROM family WHERE family_name=?',
            insertFamilyQuery = 'INSERT INTO family(family_name, process_id, process_order) VALUES(?,?,?)';

        database.query(checkFamilyNameExistQuery, [familyName])
            .then(result => {
                if (result.length > 0 && result[0]['family_name'] != oldFamilName) {
                    returnResult(res, 'Family name already exit', 1, result);
                } else {
                    //find id of process
                    database.query(deleteFamilyQuery, [oldFamilName])
                        .then(() => {
                            database.query(getProcessQuery).then(processes => {
                                processes.forEach(process => {
                                    //get id of process
                                    let processOrder = 0;
                                    familyProcess.forEach(familyProcessElement => {
                                        if (familyProcessElement == process.process_name) {
                                            processOrder = familyProcess.indexOf(process.process_name);
                                            processOrder += 1;
                                            database.query(insertFamilyQuery, [familyName, process.id, processOrder])
                                                .then(() => { })
                                                .catch(err => returnResult(res, 'Oops, error in recording family process!', 1, err));
                                        }
                                    });
                                });
                                returnResult(res, 'Updated Successfully', 0, []);
                            });
                        })
                        .catch(err => returnResult(res, 'Oops, error in removing family!', 1, err));
                }
            })
            .catch(err => returnResult(res, 'Oops, error in checking family name exist!', 1, err));
    }



};

export default familyController;
