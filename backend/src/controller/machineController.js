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

    getMachineById(req, res) {
        let query = 'SELECT * FROM op_posts WHERE id=? ORDER BY id DESC';
        let processId = req.params.id;
        database.query(query, [processId])
            .then(result => returnResult(res, 'Machine by id', 0, result))
            .catch(err => returnResult(res, 'Oops, error in getting machine!', 1, err));
    },

    updateMachine(req, res) {
        let businessUnity = req.body.raw.BusinessUnity == '' ? 0 : req.body.raw.BusinessUnity,
            name = req.body.raw.Name,
            oldId = req.body.raw.oldId,
            machineCode = req.body.raw.MachineCode,
            processId = req.body.raw.ProcessId,
            quality = req.body.raw.Quality == '' ? 0 : req.body.raw.Quality,
            eficiency = req.body.raw.Eficiency == '' ? 0 : req.body.raw.Eficiency,
            availability = req.body.raw.Availability == '' ? 0 : req.body.raw.Availability,
            setupTime = req.body.raw.SetupTime == '' ? 0 : req.body.raw.SetupTime,
            setupTimeUnity = req.body.raw.SetupTimeUnity,
            cost = req.body.raw.Cost == '' ? 0 : req.body.raw.Cost,
            costTimeUnity = req.body.raw.CostTimeUnity,
            setupLoss = req.body.raw.SetupLoss == '' ? 0 : req.body.raw.SetupLoss,
            speed = req.body.raw.Speed == '' ? 0 : req.body.raw.Speed,
            speedUnity = req.body.raw.SpeedUnity,
            speedTimeUnity = req.body.raw.SpeedTimeUnity,
            minBatch = req.body.raw.MinBatch == '' ? 0 : req.body.raw.MinBatch,
            minBatchUnity = req.body.raw.MinBatchUnity,
            maxBatch = req.body.raw.MaxBatch == '' ? 0 : req.body.raw.MaxBatch,
            maxBatchUnity = req.body.raw.MaxBatchUnity,
            groupSpeed = req.body.raw.GroupSpeed == '' ? 0 : req.body.raw.GroupSpeed,
            groupSpeedTimeUnity = req.body.raw.GroupSpeedTimeUnity,
            groupSpeedUnity = req.body.raw.GroupSpeedUnity,
            groupName = req.body.raw.GroupName,
            setupLossUnity = req.body.raw.SetupLossUnity,
            onOff = req.body.raw.OnOff,
            shiftA = req.body.raw.ShiftA,
            shiftB = req.body.raw.ShiftB,
            shiftC = req.body.raw.ShiftC,
            shiftD = req.body.raw.ShiftD,
            shiftE = req.body.raw.ShiftE,
            extraFields = JSON.stringify(req.body.raw.EXTRAFIELDS);

        let updateOpPostsQuery = 'UPDATE op_posts SET bu=?, machine_name=?, machine_code=?, ind_process_id=? WHERE id=?',
            updateOpPostParamsQuery = `UPDATE op_post_params SET bu=?, quality=?, efficiency=?, availability=?, setup_time=?, ` +
                `setup_time_unity=?, cost=?, cost_time_unity=?, setup_loss=?, setup_loss_unity=?, speed=?, speed_unity=?, ` +
                `speed_time_unity=?, min_batch=?, min_batch_unity=?, max_batch=?, max_batch_unity=?, group_speed=?, ` +
                `group_speed_time_unity=?, group_speed_unity=?, group_name=?, status=?, extra=?, shift_a=?, ` +
                `shift_b=?, shift_c=?, shift_d=?, shift_e=? WHERE op_post_id=?`,
            opPostValues = [businessUnity, name, machineCode, processId, oldId],
            OpPostParamsValues = [businessUnity, quality, eficiency, availability,
                setupTime, setupTimeUnity, cost, costTimeUnity, setupLoss, setupLossUnity, speed,
                speedUnity, speedTimeUnity, minBatch, minBatchUnity, maxBatch, maxBatchUnity, groupSpeed, groupSpeedTimeUnity,
                groupSpeedUnity, groupName, onOff, extraFields, shiftA, shiftB, shiftC, shiftD, shiftE, oldId];

        database.query(updateOpPostsQuery, opPostValues)
            .then(() => {
                database.query(updateOpPostParamsQuery, OpPostParamsValues)
                    .then(result => {
                        returnResult(res, 'Updated Successfully!', 0, result);
                    })
                    .catch(err => returnResult(res, 'Oops, Error in updating machine parameters!', 1, err));
            })
            .catch(err => returnResult(res, 'Oops, Error in updating machine!', 1, err));
    },

    createMachine(req, res) {
        let businessUnity = req.body.raw.BusinessUnity == '' ? 0 : req.body.raw.BusinessUnity,
            name = req.body.raw.Name,
            machineCode = req.body.raw.MachineCode,
            processId = req.body.raw.ProcessId,
            quality = req.body.raw.Quality == '' ? 0 : req.body.raw.Quality,
            eficiency = req.body.raw.Eficiency == '' ? 0 : req.body.raw.Eficiency,
            availability = req.body.raw.Availability == '' ? 0 : req.body.raw.Availability,
            setupTime = req.body.raw.SetupTime == '' ? 0 : req.body.raw.SetupTime,
            setupTimeUnity = req.body.raw.SetupTimeUnity,
            cost = req.body.raw.Cost == '' ? 0 : req.body.raw.Cost,
            costTimeUnity = req.body.raw.CostTimeUnity,
            setupLoss = req.body.raw.SetupLoss == '' ? 0 : req.body.raw.SetupLoss,
            speed = req.body.raw.Speed == '' ? 0 : req.body.raw.Speed,
            speedUnity = req.body.raw.SpeedUnity,
            speedTimeUnity = req.body.raw.SpeedTimeUnity,
            minBatch = req.body.raw.MinBatch == '' ? 0 : req.body.raw.MinBatch,
            minBatchUnity = req.body.raw.MinBatchUnity,
            maxBatch = req.body.raw.MaxBatch == '' ? 0 : req.body.raw.MaxBatch,
            maxBatchUnity = req.body.raw.MaxBatchUnity,
            groupSpeed = req.body.raw.GroupSpeed == '' ? 0 : req.body.raw.GroupSpeed,
            groupSpeedTimeUnity = req.body.raw.GroupSpeedTimeUnity,
            groupSpeedUnity = req.body.raw.GroupSpeedUnity,
            groupName = req.body.raw.GroupName,
            setupLossUnity = req.body.raw.SetupLossUnity,
            onOff = req.body.raw.OnOff,
            extraFields = JSON.stringify(req.body.raw.EXTRAFIELDS);

        let insertOpPostsQuery = 'INSERT INTO op_posts (bu, machine_name, machine_code, ind_process_id) VALUES (?, ?, ?, ?)',
            insertOpPostParamsQuery = `INSERT INTO op_post_params (op_post_id, bu, quality, efficiency, availability, setup_time, ` +
                `setup_time_unity, cost, cost_time_unity, setup_loss, setup_loss_unity, speed, speed_unity, ` +
                `speed_time_unity, min_batch, min_batch_unity, max_batch, max_batch_unity, group_speed, ` +
                `group_speed_time_unity, group_speed_unity, group_name, status, extra) ` +
                `VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            opPostValues = [businessUnity, name, machineCode, processId];

        let checkMachineExistQuery = 'SELECT * FROM op_posts WHERE machine_name=? OR machine_code=?',
            checkMachineValues = [name, machineCode];

        database.query(checkMachineExistQuery, checkMachineValues)
            .then(checkResult => {
                if (checkResult.length === 0) {
                    database.query(insertOpPostsQuery, opPostValues)
                        .then((opPost) => {
                            let opPostId = opPost.insertId;
                            let OpPostParamsValues = [opPostId, businessUnity, quality, eficiency, availability,
                                setupTime, setupTimeUnity, cost, costTimeUnity, setupLoss, setupLossUnity, speed,
                                speedUnity, speedTimeUnity, minBatch, minBatchUnity, maxBatch, maxBatchUnity, groupSpeed, groupSpeedTimeUnity,
                                groupSpeedUnity, groupName, onOff, extraFields];
                            database.query(insertOpPostParamsQuery, OpPostParamsValues)
                                .then(result => {
                                    returnResult(res, 'Added Successfully!', 0, result);
                                })
                                .catch(err => returnResult(res, 'Oops, Error in adding machine parameters!', 1, err));
                        })
                        .catch(err => returnResult(res, 'Oops, Error in adding machine!', 1, err));
                } else {
                    returnResult(res, 'Oops, Machine name or code is already exist!', 1, checkResult)
                }
            })
            .catch(err => returnResult(res, 'Oops, Error in checking machine!', 1, err));

    },



};

export default machineController;
