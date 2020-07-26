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

        let query = 'update  processrecord SET BusinessUnity=?,Name=?,MachineCode=?,ProcessId=?,Quality=?,Eficiency=?,Availability=?,SetupTime=?,SetupTimeUnity=?,Cost=?,CostTimeUnity=?,SetupLoss=?,SetupLossUnity=?,Speed=?,SpeedUnity=?,SpeedTimeUnity=?,MinBatch=?,MinBatchUnity=?,MaxBatch=?,MaxBatchUnity=?,GroupSpeed=?,GroupSpeedTimeUnity=?,GroupSpeedUnity=?,GroupName=?,OnOff=?,EXTRAFIELDS=?,ShiftA=?,ShiftB=?,ShiftC=?,ShiftD=?,ShiftE=? where id=?';
        let params = [businessUnity, name, machineCode, processId, quality, eficiency, availability,
            setupTime, setupTimeUnity, cost, costTimeUnity, setupLoss, setupLossUnity, speed,
            speedUnity, speedTimeUnity, minBatch, minBatchUnity, MaxBatch, MaxBatchUnity, GroupSpeed, GroupSpeedTimeUnity,
            groupSpeedUnity, groupName, onOff, extraFields, shiftA, shiftB, shiftC, shiftD, shiftE, oldId]
        database.query(query, params)
            .then(result => {
                returnResult(res, 'Updated Successfully!', 0, result);
            })
            .catch(err => returnResult(res, 'Oops, Error in updating machine!', 1, err));
    },



};

export default machineController;
