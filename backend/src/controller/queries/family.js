/*
  * Created By : khalid Hashmi
  * Created Date : 12-03-2020
  * Purpose : Declare user mutation SignUp,
*/

var { database } = require("../../constants"),

  returnResult = require('../../result');
var async = require("async");
var getFamily = async (req, res, next) => {
  let query = `SELECT * FROM family ORDER BY id DESC`;
  // database.query('select * from family group by FamilyName order by id desc').then(result => {
  database.query(query).then(result => {
    //console.log(result.length);
    returnResult(res, 0, result);
  });
}

var getFamilyByid = async (req, res, next) => {

  if (req.params.id) {
    database.query('select family.*,process.MachineName from family left join process on process.id=family.ProcessId  where FamilyName=? order by ProcessOrder asc', [req.params.id]).then(result => {
      //console.log(result.length);
      if (result.length)
        returnResult(res, 0, result);
      else
        returnResult(res, 1, { "message": "not result found" });
    });
  } else {
    returnResult(res, 1, { "message": "id not found" });
  }
}

var familyUpdate = async (req, res, next) => {

  FamilyName = req.body.raw.FamilyName;
  familyProcess = req.body.raw.familyProcess;
  oldFamilName = req.body.raw.oldFamilName;
  ProcessOrder = 1;
  database.query('select * from family where FamilyName=?', [FamilyName]).then(result => {
    //console.log(result.length);
    if (result.length > 0 && result[0]['FamilyName'] != oldFamilName) {
      res.send({ message: "Name already exists", error: 1 });
    } else {
      //find id of process
      database.query('delete from family where FamilyName=?', [oldFamilName]).then(result => {
        database.query('select * from process').then(result2 => {
          async.forEach(result2, function (element, callback) {
            //get id of process
            ProcessOrder = 0;
            async.forEach(familyProcess, function (familyProcesselement, callback) {
              //ProcessOrder=ProcessOrder+1;
              if (familyProcesselement == element.MachineName) {
                ProcessOrder = familyProcess.indexOf(element.MachineName);
                ProcessOrder = ProcessOrder + 1;
                database.query('INSERT INTO family(FamilyName,ProcessId,ProcessOrder) VALUES(?,?,?)', [FamilyName, element.Id, ProcessOrder]).then(result => {


                });

              }
            });
          });

          res.send({ message: "Updated Successfully", error: 0 });
        });
      });

    }

  });
}


module.exports = { getFamily, getFamilyByid, familyUpdate };
