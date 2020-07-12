var { database } = require("../../config/db"),

    returnResult = require('../../result');
var async = require("async");

var Formula = '';
var formulaCost = 0;

var processStatusUpdate = async (req, res, next) => {
    id = req.body.raw.id;
    status = req.body.raw.status;
    database.query('update process set Status=? where id=?', [status, id]).then(result => {
        res.send({ message: "Updated Successfully", error: 0 });
    });
}

var updateMachineStatus = async (req, res, next) => {
    id = req.body.raw.id;
    status = req.body.raw.status;
    database.query('update processrecord set OnOff=? where id=?', [status, id]).then(result => {
        res.send({ message: "Updated Successfully", error: 0 });
    });
}

var processSave = async (req, res, next) => {

    MachineName = req.body.raw.sections[0].MachineName;
    section = req.body.raw;
    section = JSON.stringify(section);
    //console.log(section);
    database.query('select * from process where MachineName=?', [MachineName]).then(result => {
        //console.log(result.length);
        if (result.length > 0) {
            res.send({ message: "Name already exists", error: 1 });
        } else {
            database.query('INSERT INTO process(MachineName,EXTRAFIELDS) VALUES(?,?)', [MachineName, section]).then(result => {
                res.send({ message: "Added Successfully", error: 0 });
            });
        }

    });
}

var getProcessid = async (req, res, next) => {

    if (req.params.id) {
        database.query('select * from process where id=?', [req.params.id]).then(result => {
            //console.log(result.length);
            if (result.length)
                returnResult(res, 0, result[0]);
            else
                returnResult(res, 1, { "message": "not result found" });
        });
    } else {
        returnResult(res, 1, { "message": "id not found" });
    }
}

var processUpdate = async (req, res, next) => {
    MachineName = req.body.raw.sections[0].MachineName;
    oldId = req.body.raw.sections[0].oldId;
    section = req.body.raw;
    // Get Shift Values
    let ShiftA = section.sections[0].ShiftA;
    let ShiftB = section.sections[0].ShiftB;
    let ShiftC = section.sections[0].ShiftC;
    let ShiftD = section.sections[0].ShiftD;
    let ShiftE = section.sections[0].ShiftE;
    // Remove Shift Values from section
    delete section.sections[0]['ShiftA']
    delete section.sections[0]['ShiftB']
    delete section.sections[0]['ShiftC']
    delete section.sections[0]['ShiftD']
    delete section.sections[0]['ShiftE']
    section = JSON.stringify(section);

    await database.query('select * from process where MachineName=? and id<>?', [MachineName, oldId]).then(result => {
        if (result.length > 0) {
            res.send({ message: "Name already exists", error: 1 });
        } else {
            database.query('update process set MachineName=?,EXTRAFIELDS=?,ShiftA=?,ShiftB=?,ShiftC=?,ShiftD=?,ShiftE=? where id=?',
                [MachineName, section, ShiftA, ShiftB, ShiftC, ShiftD, ShiftE, oldId]).then(result => {
                    res.send({ message: "Updated Successfully", error: 0 });
                });

        }
    }).catch(err => console.log('Error:', err));
}

var addProcessrecord = async (req, res, next) => {

    BusinessUnity = req.body.raw.BusinessUnity == '' ? 0 : req.body.raw.BusinessUnity;
    Name = req.body.raw.Name;
    MachineCode = req.body.raw.MachineCode;
    ProcessId = req.body.raw.ProcessId;
    Quality = req.body.raw.Quality == '' ? 0 : req.body.raw.Quality;
    Eficiency = req.body.raw.Eficiency == '' ? 0 : req.body.raw.Eficiency;
    Availability = req.body.raw.Availability == '' ? 0 : req.body.raw.Availability;
    SetupTime = req.body.raw.SetupTime == '' ? 0 : req.body.raw.SetupTime;
    SetupTimeUnity = req.body.raw.SetupTimeUnity;
    Cost = req.body.raw.Cost == '' ? 0 : req.body.raw.Cost;
    CostTimeUnity = req.body.raw.CostTimeUnity;
    SetupLoss = req.body.raw.SetupLoss == '' ? 0 : req.body.raw.SetupLoss;
    Speed = req.body.raw.Speed == '' ? 0 : req.body.raw.Speed;
    SpeedUnity = req.body.raw.SpeedUnity;
    SpeedTimeUnity = req.body.raw.SpeedTimeUnity;
    MinBatch = req.body.raw.MinBatch == '' ? 0 : req.body.raw.MinBatch;
    MinBatchUnity = req.body.raw.MinBatchUnity;
    MaxBatch = req.body.raw.MaxBatch == '' ? 0 : req.body.raw.MaxBatch;
    MaxBatchUnity = req.body.raw.MaxBatchUnity;
    GroupSpeed = req.body.raw.GroupSpeed == '' ? 0 : req.body.raw.GroupSpeed;
    GroupSpeedTimeUnity = req.body.raw.GroupSpeedTimeUnity;
    GroupSpeedUnity = req.body.raw.GroupSpeedUnity;
    GroupSpeedUnity = req.body.raw.GroupSpeedUnity;
    GroupName = req.body.raw.GroupName;
    SetupLossUnity = req.body.raw.SetupLossUnity;
    OnOff = req.body.raw.OnOff;
    EXTRAFIELDS = JSON.stringify(req.body.raw.EXTRAFIELDS);


    database.query('INSERT INTO processrecord(BusinessUnity,Name,MachineCode,ProcessId,Quality,Eficiency,Availability,SetupTime,SetupTimeUnity,Cost,CostTimeUnity,SetupLoss,SetupLossUnity,Speed,SpeedUnity,SpeedTimeUnity,MinBatch,MinBatchUnity,MaxBatch,MaxBatchUnity,GroupSpeed,GroupSpeedTimeUnity,GroupSpeedUnity,GroupName,OnOff,EXTRAFIELDS,baseMinima,baseMaxima) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [BusinessUnity, Name, MachineCode, ProcessId, Quality, Eficiency, Availability,
        SetupTime, SetupTimeUnity, Cost, CostTimeUnity, SetupLoss, SetupLossUnity, Speed,
        SpeedUnity, SpeedTimeUnity, MinBatch, MinBatchUnity, MaxBatch, MaxBatchUnity, GroupSpeed, GroupSpeedTimeUnity,
        GroupSpeedUnity, GroupName, OnOff, EXTRAFIELDS]).then(result => {
            res.send({ message: "Added Successfully", error: 0 });
        }, err => {
        });

}

var updateProcessrecord = async (req, res, next) => {

    BusinessUnity = req.body.raw.BusinessUnity == '' ? 0 : req.body.raw.BusinessUnity;
    Name = req.body.raw.Name;
    oldId = req.body.raw.oldId;
    MachineCode = req.body.raw.MachineCode;
    ProcessId = req.body.raw.ProcessId;
    Quality = req.body.raw.Quality == '' ? 0 : req.body.raw.Quality;
    Eficiency = req.body.raw.Eficiency == '' ? 0 : req.body.raw.Eficiency;
    Availability = req.body.raw.Availability == '' ? 0 : req.body.raw.Availability;
    SetupTime = req.body.raw.SetupTime == '' ? 0 : req.body.raw.SetupTime;
    SetupTimeUnity = req.body.raw.SetupTimeUnity;
    Cost = req.body.raw.Cost == '' ? 0 : req.body.raw.Cost;
    CostTimeUnity = req.body.raw.CostTimeUnity;
    SetupLoss = req.body.raw.SetupLoss == '' ? 0 : req.body.raw.SetupLoss;
    Speed = req.body.raw.Speed == '' ? 0 : req.body.raw.Speed;
    SpeedUnity = req.body.raw.SpeedUnity;
    SpeedTimeUnity = req.body.raw.SpeedTimeUnity;
    MinBatch = req.body.raw.MinBatch == '' ? 0 : req.body.raw.MinBatch;
    MinBatchUnity = req.body.raw.MinBatchUnity;
    MaxBatch = req.body.raw.MaxBatch == '' ? 0 : req.body.raw.MaxBatch;
    MaxBatchUnity = req.body.raw.MaxBatchUnity;
    GroupSpeed = req.body.raw.GroupSpeed == '' ? 0 : req.body.raw.GroupSpeed;
    GroupSpeedTimeUnity = req.body.raw.GroupSpeedTimeUnity;
    GroupSpeedUnity = req.body.raw.GroupSpeedUnity;
    GroupSpeedUnity = req.body.raw.GroupSpeedUnity;
    GroupName = req.body.raw.GroupName;
    SetupLossUnity = req.body.raw.SetupLossUnity;
    OnOff = req.body.raw.OnOff;
    ShiftA = req.body.raw.ShiftA;
    ShiftB = req.body.raw.ShiftB;
    ShiftC = req.body.raw.ShiftC;
    ShiftD = req.body.raw.ShiftD;
    ShiftE = req.body.raw.ShiftE;
    EXTRAFIELDS = JSON.stringify(req.body.raw.EXTRAFIELDS);

    database.query('update  processrecord SET BusinessUnity=?,Name=?,MachineCode=?,ProcessId=?,Quality=?,Eficiency=?,Availability=?,SetupTime=?,SetupTimeUnity=?,Cost=?,CostTimeUnity=?,SetupLoss=?,SetupLossUnity=?,Speed=?,SpeedUnity=?,SpeedTimeUnity=?,MinBatch=?,MinBatchUnity=?,MaxBatch=?,MaxBatchUnity=?,GroupSpeed=?,GroupSpeedTimeUnity=?,GroupSpeedUnity=?,GroupName=?,OnOff=?,EXTRAFIELDS=?,ShiftA=?,ShiftB=?,ShiftC=?,ShiftD=?,ShiftE=? where id=?',
        [BusinessUnity, Name, MachineCode, ProcessId, Quality, Eficiency, Availability,
            SetupTime, SetupTimeUnity, Cost, CostTimeUnity, SetupLoss, SetupLossUnity, Speed,
            SpeedUnity, SpeedTimeUnity, MinBatch, MinBatchUnity, MaxBatch, MaxBatchUnity, GroupSpeed, GroupSpeedTimeUnity,
            GroupSpeedUnity, GroupName, OnOff, EXTRAFIELDS, ShiftA, ShiftB, ShiftC, ShiftD, ShiftE, oldId])
        .then(result => {
            res.send({ message: "Updated Successfully", error: 0 });
        }, err => {
            console.log(err)
        });

}

var getProcessRecord = async (req, res, next) => {

    database.query('select * from processrecord where ProcessId=? order by Id desc', [req.params.id]).then(result => {
        if (result.length)
            returnResult(res, 0, result);
        else
            returnResult(res, 1, { "message": "not result found" });
    });

}

var getProcessMeachne = async (req, res, next) => {

    database.query('select process.*,(select count(*) from processrecord where `ProcessId`=process.Id) as machenecount from process order by Id desc').then(result => {
        //console.log(result.length);
        if (result.length)
            returnResult(res, 0, result);
        else
            returnResult(res, 1, { "message": "not result found" });
    });

}

var getProcessRecordByid = async (req, res, next) => {

    if (req.params.id) {
        database.query('select * from processrecord where id=?', [req.params.id]).then(result => {
            if (result.length)
                returnResult(res, 0, result[0]);
            else
                returnResult(res, 1, { "message": "not result found" });
        });
    } else {
        returnResult(res, 1, { "message": "id not found" });
    }
}

const getlarguraMaiorImpressora = async () => {
    return new Promise((resolve, reject) => {
        database.query('select * from processrecord where ProcessId=?', [4]).then(result => {
            let maximumWidth = 0;
            async.forEach(result, function (element, callback) {
                let EXTRAFIELDS = element.EXTRAFIELDS;
                EXTRAFIELDS = JSON.parse(EXTRAFIELDS);
                if (EXTRAFIELDS[0]['Width'] != undefined) {
                    if (EXTRAFIELDS[0]['Width'] != '' && EXTRAFIELDS[0]['Width'] > maximumWidth) {
                        maximumWidth = EXTRAFIELDS[0]['Width'];
                    }
                }
            });
            resolve(maximumWidth);


        });
    })
}

function deepCloning(objectpassed) { //Deepcloning
    if (objectpassed === null || typeof objectpassed !== 'object') {
        return objectpassed;
    }
    // give temporary-storage the original obj's constructor
    var temporarystorage = objectpassed.constructor();
    for (var odakey in objectpassed) {
        temporarystorage[odakey] = deepCloning(objectpassed[odakey]);
    }
    return temporarystorage;
}

var getQuotations = async (req, res, next) => {
    let code = req.params.code == 'undefined' ? 0 : req.params.code;
    let quentity = req.params.code == 'undefined' ? 0 : req.params.quentity;
    let positions = req.params.positions == 'undefined' ? -1 : req.params.positions;
    let query = '';
    let showall = positions;
    let process = {};
    let admProcesses;
    let minimumcost = 0;
    let meachneDetails = {};
    let timeLimit = 0;
    let MQuality = {};
    returnreslt = {};

    const combos = require('combos');
    let larguraMaiorImpressora = await getlarguraMaiorImpressora();

    database.query('select producthead.*,producthead.id as phid,family.* from producthead left join family on producthead.Family=family.FamilyName  where ProductCode=? order by ProcessOrder asc', [code]).then(result => {

        if (result.length == 0) {
            returnResult(res, 0, { result: [] });
        } else {

            /** Get timelimit for factory*/
            query = 'SELECT (SUM(ShiftA) + SUM(ShiftB) + SUM(ShiftC) + SUM(ShiftD) + SUM(ShiftE)) AS timelimit FROM process';
            database.query(query).then(result => {
                // console.log('timelimit:', result[0].timelimit)
                timeLimit = result[0].timelimit;
            }).catch(err => console.log(err))

            /** Get Adm Processes */
            query = `SELECT * FROM admprocesses WHERE Status='Active'`;
            database.query(query).then(result => {
                // console.log('admprocesses:', result)
                admProcesses = result;
            }).catch(err => console.log(err))

            // getFactoryTimeLimit().then(res => timeLimit = res);
            async.forEach(result, function (element, callback) {

                let tempmeachne = []

                let processname = "";

                database.query('SELECT processrecord.*,process.MachineName FROM `processrecord` left join process on process.Id=processrecord.ProcessId WHERE `ProcessId`=? and `OnOff`=1', [element.ProcessId]).then(result2 => {
                    async.forEach(result2, function (element2, callback) {
                        tempmeachne.push(element2.Name)
                        machnname = element2.Name;



                        machnname = machnname.replace(/\s/g, '');
                        meachneDetails[machnname] = element2;
                        processname = element2.MachineName

                    });

                    process[processname] = tempmeachne;
                    let processid = {};
                    let newpermulation = [];
                    if (result[result.length - 1]['Id'] == element.Id) {
                        const permutations = combos(process);
                        database.query('SELECT productbody.`ProductCharFatherId`,productbody.`ProductCharChildId`,productbody.`ProductCharChildValue`, productchar1.FamilyMember,productchar1.Disabled,productchar1.GridColumns,productchar1.GridSmColumns,productchar1.Label,productchar2.ProductChildDesc  FROM `productbody` left JOIN productchar1 on productbody.`ProductCharFatherId`=productchar1.`ProductCharFatherId` left JOIN productchar2 on productchar2.`ProductChildId`=productbody.`ProductCharChildId` and productchar1.ProductCharFatherId=productchar2.ProductCharFatherId  WHERE `ProductHeaderID`=?', [result[0].phid]).then(product => {
                            var srnumber = 1;
                            async.forEach(permutations, function (permutation, callback) {
                                innerpermulation = {};
                                Totaltime = 0;
                                TotalCost = 0;
                                let timecalcalcualtion = true;
                                let lastProcssvar = [];
                                let tempQuailty = 1;
                                Object.keys(permutation).forEach(function (key) {
                                    var meachne = permutation[key];
                                    machnname = meachne.replace(/\s/g, '');
                                    tempQuailty = tempQuailty * (meachneDetails[machnname].Quality / 100);
                                });


                                Object.keys(permutation).forEach(function (key) {
                                    var meachne = permutation[key];
                                    machnname = meachne.replace(/\s/g, '');

                                    returnresultobj = MachineReturn(key, meachneDetails[machnname], product, quentity, srnumber, tempQuailty, lastProcssvar, result[0].phid, larguraMaiorImpressora);

                                    lastProcssvar = returnresultobj;

                                    if (returnresultobj.length == 0) {
                                        timecalcalcualtion = false;
                                    }

                                    innerpermulation[key] = { 'name': meachne, 'extraparma': lastProcssvar };

                                    if (lastProcssvar.length == 1) {
                                        timetemp = Totaltime + returnresultobj[0]['UpTime'] + returnresultobj[0]['DownTime'];
                                        Totaltime = parseFloat(timetemp.toFixed(2));
                                        costtemp = TotalCost + returnresultobj[0]['cost'];
                                        TotalCost = parseFloat(costtemp.toFixed(2));
                                    }
                                    if (TotalCost < minimumcost)
                                        minimumcost = TotalCost;

                                });


                                if (positions >= 0) {
                                    if (srnumber - 1 == positions) {

                                        returnreslt.Time = parseFloat(Totaltime.toFixed(2));
                                        returnreslt.Cost = parseFloat(TotalCost.toFixed(2));
                                    }
                                } else {
                                    let insertpath = false;
                                    Object.keys(innerpermulation).forEach(function (key) {

                                        if (innerpermulation[key]['extraparma'].length > 1 && key == 'Extrusion') {
                                            let tempnnuewpath = {};
                                            let innerlextraKey = 0;
                                            let tempht = innerpermulation;
                                            let tempPrintArray = tempht['Printing'] ? tempht['Printing']['extraparma'] : [];
                                            let tempCuttingArray = tempht['Cutting'] ? tempht['Cutting']['extraparma'] : [];
                                            let tempFinishingArray = tempht['Finishing'] ? tempht['Finishing']['extraparma'] : [];

                                            async.forEach(innerpermulation[key]['extraparma'], function (extrapaths, callback) {

                                                //reinitilize variables
                                                var entrapathsnew = "";
                                                var temphtnew = "";
                                                let Printingcost = 0;
                                                let Cuttincost = 0;
                                                let FinishingCost = 0;

                                                // console.log(innerlextraKey);
                                                // console.log('Original array =====> ', tempPrintArray);
                                                // console.log('Will check the length', tempPrintArray.length);

                                                if (tempPrintArray.length > 0) {
                                                    if (tempPrintArray[innerlextraKey]['C1'] == undefined)
                                                        timecalcalcualtion = false;
                                                    Printingcost = tempPrintArray[innerlextraKey]['cost'];
                                                    tempht['Printing']['extraparma'] = tempPrintArray[innerlextraKey];
                                                    // console.log('innerlextraKey', innerlextraKey);
                                                    // console.log(' ');
                                                } else {

                                                }
                                                if (tempCuttingArray.length > 0) {
                                                    if (tempCuttingArray[innerlextraKey]['C1'] == undefined)
                                                        timecalcalcualtion = false;
                                                    Cuttincost = tempCuttingArray[innerlextraKey]['cost'];
                                                    tempht['Cutting']['extraparma'] = tempCuttingArray[innerlextraKey];
                                                }
                                                if (tempFinishingArray.length > 0) {
                                                    if (tempFinishingArray[innerlextraKey]['C1'] == undefined)
                                                        timecalcalcualtion = false;
                                                    FinishingCost = tempFinishingArray[innerlextraKey]['cost'];
                                                    tempht['Finishing']['extraparma'] = tempFinishingArray[innerlextraKey];
                                                }
                                                innerlextraKey = innerlextraKey + 1;

                                                // console.log('Array in innerlextraKey =====> ', tempPrintArray);

                                                var entrapathsoriginal = extrapaths;
                                                var entrapathsnew = (deepCloning(entrapathsoriginal));

                                                if (timecalcalcualtion == false) {
                                                    timetemp = Totaltime + entrapathsnew['UpTime'] + entrapathsnew['DownTime'];
                                                    tempht['Time'] = "N/A";
                                                    costtemp = TotalCost + entrapathsnew['cost'];
                                                    tempht['Cost'] = "N/A";
                                                } else {
                                                    timetemp = Totaltime + entrapathsnew['UpTime'] + entrapathsnew['DownTime'];
                                                    tempht['Time'] = parseFloat(timetemp.toFixed(2));
                                                    costtemp = TotalCost + entrapathsnew['cost'] + Cuttincost + Printingcost + FinishingCost;
                                                    tempht['Cost'] = parseFloat(costtemp.toFixed(2));
                                                }

                                                tempht[key]['extraparma'] = entrapathsnew;

                                                if (entrapathsnew['C1'] == undefined) {
                                                    timecalcalcualtion = false;
                                                }

                                                var temphtoriginal = tempht;
                                                var temphtnew = (deepCloning(temphtoriginal));

                                                newpermulation.push(temphtnew);

                                                newpermulation.forEach(print);

                                                function print(item) {
                                                }

                                                insertpath = true;
                                                srnumber = srnumber + 1;
                                            });
                                        } else {

                                            if (innerpermulation[key]['extraparma'].length == 1) {

                                                if (innerpermulation[key]['extraparma'][0]['C1'] == undefined)
                                                    timecalcalcualtion = false;

                                                innerpermulation[key]['extraparma'] = innerpermulation[key]['extraparma'][0];
                                            } else {
                                                timecalcalcualtion = false;
                                            }
                                        }
                                    });

                                    if (insertpath == false) {
                                        if (timecalcalcualtion == false) {
                                            innerpermulation['Time'] = "N/A";
                                            innerpermulation['Cost'] = "N/A";
                                            newpermulation.push(innerpermulation);
                                            srnumber = srnumber + 1;
                                        } else {
                                            innerpermulation['Time'] = Totaltime;
                                            innerpermulation['Cost'] = TotalCost;
                                            newpermulation.push(innerpermulation);
                                            srnumber = srnumber + 1;
                                        }
                                    }

                                }
                            });



                            let finalresult = [];
                            let minimumscost = 0;
                            async.forEach(newpermulation, function (temppath, callback) {
                                let Temptoalacost = 0;
                                let Temptoalatime = 0;

                                let tempMixtureCost = temppath['Mixture'] ? temppath['Mixture']['extraparma']['cost'] : 0;
                                let tempExtrusionCost = temppath['Extrusion'] ? temppath['Extrusion']['extraparma']['cost'] : 0;
                                let tempPrintingCost = temppath['Printing'] ? temppath['Printing']['extraparma']['cost'] : 0;
                                let tempCuttingCost = temppath['Cutting'] ? temppath['Cutting']['extraparma']['cost'] : 0;
                                let tempFinishingCost = temppath['Finishing'] ? temppath['Finishing']['extraparma']['cost'] : 0;
                                Temptoalacost = tempMixtureCost + tempExtrusionCost + tempPrintingCost + tempCuttingCost + tempFinishingCost;

                                let tempMixtureUpTime = temppath['Mixture'] ? temppath['Mixture']['extraparma']['UpTime'] : 0;
                                let tempExtrusionUpTime = temppath['Extrusion'] ? temppath['Extrusion']['extraparma']['UpTime'] : 0;
                                let tempCuttingUpTime = temppath['Cutting'] ? temppath['Cutting']['extraparma']['UpTime'] : 0;
                                let tempPrintingUpTime = temppath['Printing'] ? temppath['Printing']['extraparma']['UpTime'] : 0;
                                let tempFinishingUpTime = temppath['Finishing'] ? temppath['Finishing']['extraparma']['UpTime'] : 0;
                                let tempMixtureDownTime = temppath['Mixture'] ? temppath['Mixture']['extraparma']['DownTime'] : 0;
                                let tempExtrusionDownTime = temppath['Extrusion'] ? temppath['Extrusion']['extraparma']['DownTime'] : 0;
                                let tempPrintingDownTime = temppath['Printing'] ? temppath['Printing']['extraparma']['DownTime'] : 0;
                                let tempCuttingDownTime = temppath['Cutting'] ? temppath['Cutting']['extraparma']['DownTime'] : 0;
                                let tempFinishingDownTime = temppath['Finishing'] ? temppath['Finishing']['extraparma']['DownTime'] : 0;
                                Temptoalatime = tempMixtureUpTime + tempExtrusionUpTime + tempCuttingUpTime + tempPrintingUpTime + tempFinishingUpTime + tempMixtureDownTime + tempExtrusionDownTime + tempCuttingDownTime + tempFinishingDownTime + tempPrintingDownTime;

                                // let Temptoalacost = temppath['Mixture']['extraparma']['cost'] + temppath['Extrusion']['extraparma']['cost'] + temppath['Printing']['extraparma']['cost'] + temppath['Cutting']['extraparma']['cost'] + temppath['Finishing']['extraparma']['cost'];
                                // let Temptoalatime = temppath['Mixture']['extraparma']['UpTime'] + temppath['Extrusion']['extraparma']['UpTime'] + temppath['Printing']['extraparma']['UpTime'] + temppath['Cutting']['extraparma']['UpTime'] + temppath['Finishing']['extraparma']['UpTime'];

                                if (temppath['Cost'] != 'N/A') {
                                    temppath['Cost'] = parseFloat(Temptoalacost.toFixed(2));
                                    temppath['Time'] = parseFloat(Temptoalatime.toFixed(2));
                                }
                                if (positions == 'false') {
                                    if (minimumscost == 0 && Temptoalacost) {
                                        minimumscost = Temptoalacost;
                                        temppath['Cost'] = parseFloat(minimumscost).toFixed(2);
                                        temppath['Time'] = parseFloat(Temptoalatime).toFixed(2);
                                        finalresult = [temppath];
                                    }
                                    if (Temptoalacost < minimumscost) {
                                        minimumscost = Temptoalacost;
                                        temppath['Cost'] = parseFloat(minimumscost).toFixed(2);
                                        temppath['Time'] = parseFloat(Temptoalatime).toFixed(2);
                                        finalresult = [temppath];
                                    }
                                } else {
                                    finalresult.push(temppath);
                                }
                            });

                            /** Get Formula Cost */
                            query = `SELECT Cost FROM structure WHERE Formula=${Formula}`;
                            database.query(query).then(result => {

                                formulaCost = result[0].Cost
                                returnreslt.result = finalresult;
                                returnreslt.admProcesses = admProcesses;
                                returnreslt.code = code;
                                returnreslt.quentity = quentity;
                                returnreslt.minimumcost = minimumcost;
                                returnreslt.FormulaCode = Formula;
                                returnreslt.FormulaCost = formulaCost;
                                returnreslt.timeLimit = timeLimit;

                                returnResult(res, 0, returnreslt);
                            }).catch(err => console.log(err))


                        });

                    }

                });

            });
        }

    });
}

//calculation time and cost function 
function MachineReturn(process, machine, product, quentity, Sequence, totalQualidade, lastprocess, HeaderID, larguraMaiorImpressora) {

    result = [];

    Quality = machine.Quality;
    Quality = Quality / 100;

    machineExtrafields = JSON.parse(machine['EXTRAFIELDS']);
    machiextrafieldsMap = {};
    async.forEach(machineExtrafields, function (extrafields, callback) {
        for (var i in extrafields) {

            machiextrafieldsMap[i] = extrafields[i];
        }
    });
    machineExtrafields = machiextrafieldsMap;

    var material = "";
    var Base = "";
    let productfield = {};
    async.forEach(product, function (produc, callback) {
        if (produc.Label == "Material") {
            material = produc.ProductCharChildValue;
        }

        if (produc.Label == "Base") {
            Base = produc.ProductCharChildValue;
        }
        let laelt = produc.Label;
        laelt = laelt.replace(/\s/g, '')
        if (produc.ProductCharChildValue != 0)
            productfield[laelt] = produc.ProductCharChildValue;
        else
            productfield[laelt] = produc.ProductCharChildId;
    });

    //PREPARA PRIMEIRO PROCESSO
    if (machine.ProcessId == 1) { //Mixture
        if (lastprocess.length > 0) {
            lastprocess = lastprocess[lastprocess.length - 1];
        }
        let pesoEspecifico = 0;

        // if (Formula == '') {
        Formula = productfield['FórmulaBase'];
        // }

        if (productfield['Material'] == 1) {
            pesoEspecifico = 0.92;
        }
        if (productfield['Material'] == 2) {
            pesoEspecifico = 0.921;
            //0.921
        }

        if (productfield['Material'] == 3) {
            if (productfield['CordaEmbalagem'] == 1) //fix
            {
                pesoEspecifico = 0.919;
            }
            else {
                pesoEspecifico = 0.927;
            }
        }
        if (productfield['Material'] == 4) {
            pesoEspecifico = 0.937;
        }
        if (productfield['Material'] == 5) {
            pesoEspecifico = 0.94;
        }
        if (productfield['Material'] == 6) {
            pesoEspecifico = 0.910;
        }
        if (productfield['Material'] == 7) {
            pesoEspecifico = 1;
        }

        //2 paredes = Tubular E Saco

        let paredes = 1;
        if (productfield['GrupodeProduto'] == 1 || productfield['GrupodeProduto'] == 4) {
            paredes = 2;
        }

        let pesoMistura = 0;
        let peso = (paredes * productfield['Largura(mm)'] * productfield['Altura(mm)'] * productfield['Espessura(mm)'] * pesoEspecifico * quentity) / 1000000;

        if (productfield['TipodeProduto'] != 1) {
            var C10 = (quentity * 1000000) / (paredes * productfield['Largura(mm)'] * productfield['Espessura(mm)'] * pesoEspecifico);
            peso = quentity;
        }

        var originalweight = peso;

        peso = peso / totalQualidade;
        pesoMistura = peso;

        //FIM CALCULO DE PESO DA MISTURA

        let batch = machine.MaxBatch;

        let tempo = parseInt(Math.trunc(peso / batch));

        let resto = parseInt(peso % batch);

        if (resto > 0) {
            tempo++;
        }

        let setupTime = machine.SetupTime;

        let cicle = machine.Speed;

        cicle = 60 / cicle;

        let custo = machine.Cost;

        let time = (cicle + setupTime) * tempo;
        let downTime = (setupTime) * tempo;
        let upTime = time - downTime;

        time = time / 60;
        downTime = downTime / 60;
        upTime = upTime / 60;
        let tempresult = {};

        tempresult.time = time;
        tempresult.DownTime = downTime;
        tempresult.UpTime = upTime;
        tempresult.cost = (time * custo);
        tempresult.C1 = pesoMistura * Quality;
        tempresult.C0 = originalweight;
        result.push(tempresult)
        //console.log("Mixture: ", tempresult);
    }

    if (machine.ProcessId == 2) //Extrusion

    {
        if (lastprocess.length > 0) {
            lastprocess = lastprocess[lastprocess.length - 1];
        }
        let numeroDePistas = 0;

        let larguraDaPista = 0;
        let tempresult = {};
        let custoHora = machine.Cost;

        let produtividade = machine.Speed;

        let produtividadeGrupo = machine.GroupSpeed;

        if (produtividadeGrupo != null) {
            produtividade = produtividadeGrupo;
        }

        let larguraDaMaquina = machineExtrafields.Width;

        var camadasBase = 1;

        if (productfield['Base'] != 1) {
            camadasBase = 3;
        }

        let baseMaxima = machineExtrafields['LabelsMax'];

        let baseMinima = machineExtrafields['LabelsMin'];

        let matriz = machineExtrafields['Die'];

        let qualidade = machine.Quality;

        qualidade = qualidade / 100;

        let eficiencia = machine.Eficiency;

        eficiencia = eficiencia / 100;

        let setupTime = machine.SetupTime;

        setupTime = setupTime / 60;

        let PEBD = machineExtrafields['PEBD'];
        let PEBDL = machineExtrafields['PEBDL'];
        let PEMD = machineExtrafields['PEMD'];
        let PEMDL = machineExtrafields['PEMDL'];

        let razaoMin = 0;

        let razaoMax = 0;

        let maquinaValida = false;

        // CHECAR SE A MAQUINA FAZ ESSE PRODUTO
        if (camadasBase >= baseMinima && camadasBase <= baseMaxima) {
            maquinaValida = true;
        }

        if (maquinaValida == true) {
            if (productfield['Material'] == 1 && PEBD == 'N') {
                maquinaValida = false;
            }

            if (productfield['Material'] == 2 && PEMD == 'N') {
                maquinaValida = false;
            }

            if (productfield['Material'] == 3 && PEBDL == 'N') {
                maquinaValida = false;
            }

            if (productfield['Material'] == 4 && PEMDL == 'N') {
                maquinaValida = false;
            }

            if (productfield['Material'] == 5 && PEMDL == 'N') {
                maquinaValida = false;
            }

            if (productfield['Material'] == 6 && baseMaxima != 3) {
                maquinaValida = false;
            }

            if (productfield['Material'] == 7) {
                maquinaValida = false;
            }

        }

        if (maquinaValida == true) {
            if (productfield['Picote'] == 2) {

            }
        }

        let minBatch = machine.minBatch;

        // FIM CHECAR SE A MAQUINA FAZ ESSE PRODUTO

        if (maquinaValida) {

            if (productfield['Material'] == 1 || productfield['Material'] == 3) {
                razaoMin = 2.1;
                razaoMax = 3.5;
            }

            if (productfield['Material'] == 2) {
                razaoMin = 2.4;
                razaoMax = 3.8;
            }

            if (productfield['Material'] == 4 || productfield['Material'] == 6) {
                razaoMin = 2.1;
                razaoMax = 3.1;
            }

            if (productfield['Material'] == 5) {
                razaoMin = 2.1;
                razaoMax = 3.1;
            }

            if (productfield['GrupodeProduto'] == 1 && productfield['TipodeSolda'] != 5) {
                larguraDaPista = productfield['Altura(mm)'];
                larguraDaPista2 = larguraDaPista;
                alturaDaPista = productfield['Largura(mm)'];
            }
            else {
                larguraDaPista = productfield['Largura(mm)'];
                alturaDaPista = productfield['Altura(mm)'];
                larguraDaPista2 = larguraDaPista;
            }

            if (productfield['GrupodeProduto'] == 1 || productfield['GrupodeProduto'] == 4 || productfield['Geometria'] == 3) {
                larguraDaPista = larguraDaPista * 2;
            }

            let refile = 30;

            if (productfield['GrupodeProduto'] == 4) // TUBULAR
            {
                refile = 0;
            }

            let pistas = parseInt(larguraDaMaquina / (larguraDaPista));

            if ((pistas * (larguraDaPista + refile)) >= larguraDaMaquina) {
                pistas--;
            }

            let pesoMistura = 0;

            let pesoEspecifico = 0;

            if (productfield['Material'] == 1) {
                pesoEspecifico = 0.92;
            }
            if (productfield['Material'] == 2) {
                pesoEspecifico = 0.921;
                //0.921
            }
            if (productfield['Material'] == 3) {
                if (productfield['CordaEmbalagem'] == 1) {
                    pesoEspecifico = 0.919;
                }
                else {
                    pesoEspecifico = 0.927;
                }
            }
            if (productfield['Material'] == 4) {
                pesoEspecifico = 0.937;
            }
            if (productfield['Material'] == 5) {
                pesoEspecifico = 0.94;
            }
            if (productfield['Material'] == 6) {
                pesoEspecifico = 0.910;
            }
            if (productfield['Material'] == 7) {
                pesoEspecifico = 1;
            }

            var coresFrente = productfield['NúmerodeCoresFrente'];
            var coresVerso = productfield['NúmerodeCoresVerso'];

            if (coresFrente == 9 && coresVerso == 9) {
                larguraMaiorImpressora = 2000; // MAIOR LARGURA DO REFILE.
            }

            let pistasPeloProduto = 0;
            let pistasPelaImpressora = 0;

            let calculoRefile = 2;
            if (productfield['GrupodeProduto'] == 1 || productfield['GrupodeProduto'] == 2) {
                calculoRefile = 1;
            }

            let pistas1 = 0;
            let larg1 = 0;
            let pistas2 = 0;
            let larg2 = 0;

            try {

                let sequencia = 1;

                pesoMistura = lastprocess.C1;

                let razaoDesopro = 0;

                let teste = 0;

                let acabou = false;

                let larguraDaPistaNova = 0;

                let larguraPelaImpressora = 0;

                let vez = 1;
                let par = true;

                for (let i = 1; i <= pistas; i++) {

                    if (i % 2 == 0) {
                        par = true;
                    } else {
                        par = false;
                    }

                    teste = 0;
                    acabou = false;

                    if (pesoMistura < minBatch) {
                        acabou = true;
                    }

                    let i1 = 0;
                    let i2 = 0;

                    while (acabou == false) {
                        let vaiSair = (i * larguraDaPista) + refile;

                        let tempvarl = {};
                        if (calculoRefile == 2) // DE BOBINAS
                        {

                            //PISTAS 1

                            if (vez == 1) {
                                larguraDaPistaNova = (i * larguraDaPista) + refile;
                                acabou = true;
                                pistas1 = 1;
                                larg1 = larguraDaPistaNova;
                                pistas2 = 0;
                                larg2 = 0;
                                i1 = i;
                            } else {
                                larguraDaPistaNova = ((i / 2) * larguraDaPista) + refile;
                                acabou = true;
                                pistas1 = 2;
                                larg1 = larguraDaPistaNova;
                                pistas2 = 0;
                                larg2 = 0;
                                i1 = i;
                            }

                            //PISTAS 2

                            if (vez == 1) {
                                i2 = i - i1;
                                if (i2 > 0) { pistas2 = 1 } else { pistas2 = 0; }

                                if (i2 == 0) { larg2 = 0 } else { larg2 = (i2 * larguraDaPista) + refile; }

                                if (larg2 == larg1) {
                                    pistas1 += 1;
                                    pistas2 = 0;
                                    larg2 = 0;
                                    i1 = i;
                                }

                                acabou = true;
                            } else {
                                acabou = true;
                            }

                            larguraDaPistaNova = (pistas1 * larg1) + (pistas2 * larg2);
                        }
                        else // DE SACOS
                        {
                            let B4 = larguraMaiorImpressora / larguraDaPista;

                            let B5 = Math.trunc(B4);

                            let B10 = (i * larguraDaPista) / larguraDaPista;

                            let C9 = (i * larguraDaPista) / larguraDaPista;

                            let F9 = (C9 * larguraDaPista) + refile;

                            let H9 = F9 - refile;

                            let minB5B10 = B5;

                            if (B5 > B10) { minB5B10 = B10 }

                            let J9 = larguraDaPista * minB5B10;

                            pistas1 = Math.floor(H9 / J9);

                            larg1 = minB5B10 * larguraDaPista;

                            larg2 = H9 - (larg1 * pistas1);

                            pistas2 = Math.ceil(larg2 / (minB5B10 * larguraDaPista));

                            larguraDaPistaNova = (pistas1 * larg1) + (pistas2 * larg2) + refile;

                            acabou = true;
                        }

                        //console.log('-----------------');
                        //console.log(machine.Name);
                        //console.log('i: ', i);
                        //console.log('pistas1: ', pistas1);
                        //console.log('larg1: ', larg1);
                        //console.log('pistas2: ', pistas2);
                        //console.log('larg2: ', larg2);

                        razaoDesopro = ((larguraDaPistaNova * 6.37) / (matriz)) / 10;
                        //console.log('larguraDaPistaNova', larguraDaPistaNova);
                        //console.log('matriz', matriz);

                        if (((pistas1 * larg1) + (pistas2 * larg2)) <= larguraDaMaquina) {

                            //console.log('razaoDesopro', razaoDesopro);
                            //console.log('razaoMin', razaoMin);
                            //console.log('razaoMax', razaoMax);

                            if (razaoDesopro >= razaoMin && razaoDesopro <= razaoMax) {
                                //console.log('Deu razão: ', larg1);
                                numeroDePistas = i;
                                let larguraExt = (numeroDePistas * larguraDaPista) + refile;
                                let tempo = (lastprocess.C1 / (produtividade * eficiencia)) + setupTime;

                                let downTime = setupTime;

                                let upTime = tempo - setupTime;

                                let custo = tempo * custoHora;

                                tempvarl.C1 = lastprocess.C1 * qualidade;
                                tempvarl.C2 = pistas1;
                                tempvarl.C3 = larg1;
                                //console.log("PistaC3: ", larg1);
                                tempvarl.C4 = pistas2;
                                tempvarl.C5 = larg2;
                                tempvarl.C6 = larguraDaPista;

                                //calcula metros refile

                                let paredes = 1;
                                if (productfield['GrupodeProduto'] == 1 || productfield['GrupodeProduto'] == 4) {
                                    paredes = 2;
                                }

                                //CALCULO METROS
                                var metros = (1 / ((pesoEspecifico * productfield['Espessura(mm)'] * larguraDaPista2 * paredes) / (1000000 * lastprocess.C1))) / 1000;

                                let metros1p1 = (tempvarl.C2 * tempvarl.C3) / ((tempvarl.C2 * tempvarl.C3) + (tempvarl.C4 * tempvarl.C5));
                                let pistasm1 = (tempvarl.C3 / tempvarl.C6);
                                let metros1p2 = (metros * metros1p1);
                                let metros1 = (metros1p2 / pistasm1);


                                let metros2 = 0;

                                if (tempvarl.C5 > 0) {
                                    let metros2p1 = (tempvarl.C4 * tempvarl.C5) / ((tempvarl.C2 * tempvarl.C3) + (tempvarl.C4 * tempvarl.C5));
                                    let pistasm2 = (tempvarl.C5 / tempvarl.C6);
                                    let metros2p2 = (metros * metros2p1);
                                    metros2 = (metros2p2 / pistasm2);
                                }

                                let metrosRefile = 0;

                                metrosRefile = (metros1 + metros2) * qualidade;

                                if ((productfield['GrupodeProduto'] != 3) && (pistas2 == 0) && (larguraDaPista == larg1)) {
                                    metrosRefile = 0;
                                }

                                metros = metros * qualidade;

                                tempvarl.C7 = Math.round(metrosRefile, 0);
                                tempvarl.C8 = Math.round(metros, 0);

                                //fim calculo metros refile

                                tempvarl.DownTime = downTime;
                                tempvarl.UpTime = upTime;
                                tempvarl.cost = custo;
                                tempvarl.IdOrigem = Sequence;

                                result.push(tempvarl);
                                //console.log('-----------------');
                                //console.log("Extrusion: ", tempvarl);
                                sequencia++;

                            }

                        } else {
                            tempvarl.C1 = 0;
                            tempvarl.C2 = 0;
                            tempvarl.C3 = 0;
                            tempvarl.C4 = 0;
                            tempvarl.C5 = 0;
                            tempvarl.C6 = 0;
                            tempvarl.C7 = 0;
                            tempvarl.C8 = 0;
                            tempvarl.DownTime = 0;
                            tempvarl.UpTime = 0;
                            tempvarl.cost = 0;
                            tempvarl.IdOrigem = Sequence;
                        }
                    }

                    if (par == true && vez == 1) {
                        i--;
                        vez = 2;
                    } else {
                        vez = 1;
                    }

                    if (par = false) {
                        vez = 1;
                    }

                    if (vez == 2) {
                        vez == 1;
                    }

                }
            }
            catch
            {

            }
        }
    }

    if (machine.ProcessId == 3) { //Deactivated
    }

    if (machine.ProcessId == 4) { //Printing 

        lastprocessG = lastprocess;
        async.forEach(lastprocessG, function (lastprocess, callback) {
            let tempvarl = {};
            var coresFrente = productfield['NúmerodeCoresFrente'];
            var coresVerso = productfield['NúmerodeCoresVerso'];

            if (coresFrente == 9) {
                coresFrente = 0;
            }

            if (coresVerso == 9) {
                coresVerso = 0;
            }

            let totalCores = (coresFrente + coresVerso);

            let SetupTime = machine.SetupTime;

            SetupTime = (SetupTime * totalCores) / 60;

            var TipoImpressao = productfield['Impressão'];

            let larguraDaMaquina = machineExtrafields.Width;
            let corMax = machineExtrafields.MaxColor;

            var velocidadeDaMaquina = machine.GroupSpeed;

            var eficiencia = machine.Eficiency;

            eficiencia = eficiencia / 100;

            velocidadeDaMaquina = (velocidadeDaMaquina * 60) * eficiencia; //Velocidade em horas

            var custoHora = machine.Cost;

            var qualidade = machine.Quality;

            qualidade = qualidade / 100;

            let pesoEspecifico = 0;

            if (productfield['Material'] == 1) {
                pesoEspecifico = 0.92;
            }
            if (productfield['Material'] == 2) {
                pesoEspecifico = 0.921;
                //0.921
            }
            if (productfield['Material'] == 3) {
                if (productfield['CordaEmbalagem'] == 1) {
                    pesoEspecifico = 0.919;
                }
                else {
                    pesoEspecifico = 0.927;
                }
            }
            if (productfield['Material'] == 4) {
                pesoEspecifico = 0.937;
            }
            if (productfield['Material'] == 5) {
                pesoEspecifico = 0.94;
            }
            if (productfield['Material'] == 6) {
                pesoEspecifico = 0.910;
            }
            if (productfield['Material'] == 7) {
                pesoEspecifico = 1;
            }


            let maquinaValida = false;

            if (totalCores <= corMax) {
                maquinaValida = true;
            }

            //console.log(machine.Name);
            //console.log(maquinaValida);

            if (maquinaValida == true) {

                let sequencia = 1;

                let tentativaNumeroPistas = parseInt(Math.trunc(larguraDaMaquina / lastprocess.C3));
                //console.log('larguraDaMaquina', larguraDaMaquina);
                //console.log('lastprocess.C3', lastprocess.C3);
                //console.log('tentativaNumeroPistas', tentativaNumeroPistas);

                if (tentativaNumeroPistas > 0) {

                    let pesonovo = lastprocess.C1 * qualidade;

                    let paredes = 1;
                    if (productfield['GrupodeProduto'] == 1 || productfield['GrupodeProduto'] == 4) {
                        paredes = 2;
                    }

                    larguraDaPista = lastprocess.C6;

                    if (productfield['GrupodeProduto'] == 1 && productfield['TipodeSolda'] != 5) {
                        larguraDaPista = productfield['Altura(mm)'];
                        larguraDaPista2 = larguraDaPista;
                        alturaDaPista = productfield['Largura(mm)'];
                    }
                    else {
                        larguraDaPista = productfield['Largura(mm)'];
                        alturaDaPista = productfield['Altura(mm)'];
                        larguraDaPista2 = larguraDaPista;
                    }

                    larguraDaPista = lastprocess.C6;

                    //CALCULO METROS
                    var metros = (1 / ((pesoEspecifico * productfield['Espessura(mm)'] * larguraDaPista2 * paredes) / (1000000 * lastprocess.C1))) / 1000;
                    //console.log('Metros: ', metros);
                    let metros1p1 = (lastprocess.C2 * lastprocess.C3) / ((lastprocess.C2 * lastprocess.C3) + (lastprocess.C4 * lastprocess.C5));
                    let pistasm1 = (lastprocess.C3 / lastprocess.C6);
                    let metros1p2 = (metros * metros1p1);
                    let metros1 = (metros1p2 / pistasm1);


                    let metros2 = 0;

                    if (lastprocess.C5 > 0) {
                        let metros2p1 = (lastprocess.C4 * lastprocess.C5) / ((lastprocess.C2 * lastprocess.C3) + (lastprocess.C4 * lastprocess.C5));
                        let pistasm2 = (lastprocess.C5 / lastprocess.C6);
                        let metros2p2 = (metros * metros2p1);
                        metros2 = (metros2p2 / pistasm2);
                    }

                    let metrosTotal = (metros1 + metros2);

                    // 100 ou 200 metros SetUp a mais na Mistura!!!???

                    if (lastprocess.C4 > 0) {
                        SetupTime += (SetupTime * 0.5); //Setupinho
                    }

                    let trocaBobina = ((lastprocess.C1 / 100) * (0.05)); // 3 minutos pra troca de bobina a cada 100Kg - TEM QUE MELHORAR ISSO

                    SetupTime += trocaBobina;

                    let tempo = (metrosTotal / velocidadeDaMaquina) + SetupTime;
                    //console.log(tempo);

                    let downtime = SetupTime;
                    let uptime = tempo - downtime;

                    let custo = (tempo * custoHora);

                    let metrosRefile = 0;

                    if ((lastprocess.C3 / lastprocess.C6) > 1) {
                        metrosRefile = metros1 + metros2;
                    }

                    metrosRefile = metrosRefile * qualidade;
                    metros = metros * qualidade;

                    pesonovo = lastprocess.C1 * qualidade;
                    tempvarl.C1 = pesonovo;
                    tempvarl.C2 = lastprocess.C2;
                    tempvarl.C3 = lastprocess.C3;
                    tempvarl.C4 = lastprocess.C4;
                    tempvarl.C5 = lastprocess.C5;
                    tempvarl.C6 = lastprocess.C6;
                    tempvarl.C7 = metrosRefile;
                    tempvarl.C8 = metros;
                    tempvarl.cost = custo;
                    tempvarl.DownTime = downtime;
                    tempvarl.UpTime = uptime;
                    tempvarl.IdOrigem = Sequence;

                    sequencia++;
                }

            }
            result.push(tempvarl);
            //console.log("Printing: ", tempvarl);
            //console.log('---------------------');
        });

    }

    if (machine.ProcessId == 5) { //Cutting 
        lastprocessG = lastprocess;

        async.forEach(lastprocessG, function (lastprocess, callback) {
            let tempvarl = {};
            let velocidade = machine.Speed;

            let setupTime = machine.SetupTime;

            let larguraDaMaquina = machine.Width;

            let qualidade = machine.Quality;
            qualidade = qualidade / 100;

            let eficiencia = machine.Eficiency;
            eficiencia = eficiencia / 100;

            let custoPorHora = machine.Cost;

            var tipoDeSolda = productfield['TipodeSolda'];

            var GrupoDoProduto = productfield['GrupodeProduto'];

            let alturaDoProduto = productfield['Altura(mm)'];

            let larguraDoProduto = productfield['Largura(mm)'];

            let larguraDaPista = 0;
            let alturaDaPista = 0;

            if (GrupoDoProduto == 1 && tipoDeSolda != 5) {
                larguraDaPista = alturaDoProduto;
                alturaDaPista = larguraDoProduto;

            }
            else {
                larguraDaPista = larguraDoProduto;
                alturaDaPista = alturaDoProduto;
            }

            let tempo = 0;
            let custo = 0;

            let sequencia = 1;

            if (lastprocess.C7 > 0) {

                let trocaBobina = ((lastprocess.C1 / 200) * (5)); // 5 minutos pra troca de bobina a cada 200Kg - TEM QUE MELHORAR ISSO

                tempo = (lastprocess.C7 / (velocidade * eficiencia)) + setupTime + trocaBobina;

                tempo = tempo / 60;

                let downTime = setupTime + trocaBobina;
                downTime = downTime / 60;

                let upTime = tempo - downTime;

                tempo = Math.round(tempo, 4);

                custo = tempo * custoPorHora;

                tempvarl.C1 = lastprocess.C1 * qualidade;
                tempvarl.C2 = lastprocess.C2;
                tempvarl.C3 = lastprocess.C3;
                tempvarl.C4 = lastprocess.C4;
                tempvarl.C5 = lastprocess.C5;
                tempvarl.C6 = lastprocess.C6;
                tempvarl.C7 = lastprocess.C7;
                tempvarl.C8 = lastprocess.C8 * qualidade;
                tempvarl.cost = custo;
                tempvarl.DownTime = downTime;
                tempvarl.UpTime = upTime;
                tempvarl.IdOrigem = Sequence;

            }
            else {

                tempvarl.C1 = lastprocess.C1;
                tempvarl.C2 = lastprocess.C2;
                tempvarl.C3 = lastprocess.C3;
                tempvarl.C4 = lastprocess.C4;
                tempvarl.C5 = lastprocess.C5;
                tempvarl.C6 = lastprocess.C6;
                tempvarl.C7 = lastprocess.C7;
                tempvarl.C8 = lastprocess.C8;
                tempvarl.cost = 0;
                tempvarl.DownTime = 0;
                tempvarl.UpTime = 0;
                tempvarl.IdOrigem = Sequence;
                sequencia++;
            }

            result.push(tempvarl);
            // console.log("Cutting: ", tempvarl);
        });
    }

    if (machine.ProcessId == 6) { //Finishing
        lastprocessG = lastprocess;

        async.forEach(lastprocessG, function (lastprocess, callback) {
            tempvarl = {};
            let maquinaValida = false;

            let qualidade = machine.Quality;
            qualidade = qualidade / 100;

            let eficiencia = machine.Eficiency;
            eficiencia = eficiencia / 100;

            let nomeDoGrupo = machine.GroupName;

            let bainha = machineExtrafields.Bainha;
            let lateralSimples = machineExtrafields.LateralSimples;
            let fundoRedondo = machineExtrafields.FundoRedondo;
            let fundo = machineExtrafields.Fundo;
            let valvulado = machineExtrafields.Valvulado;

            var tipoDeSolda = productfield['TipodeSolda'];

            var GrupoDoProduto = productfield['GrupodeProduto'];

            let alturaDoProduto = productfield['Altura(mm)'];

            let larguraDoProduto = productfield['Largura(mm)'];

            let alturaDaPista = 0;

            if (GrupoDoProduto == 1 && tipoDeSolda != 5) {
                alturaDaPista = larguraDoProduto;
            }
            else {
                alturaDaPista = alturaDoProduto;
            }

            let velocidade = machine.Speed;
            if (machine.GroupSpeed > 0) {
                velocidade = machine.GroupSpeed;
            }

            velocidade = (velocidade * 60 * (alturaDaPista / 1000)) * eficiencia;

            let setupTime = machine.SetupTime;
            setupTime = setupTime / 60;

            let custoHora = machine.Cost;

            if (tipoDeSolda == 2 && bainha == 'Yes') {
                maquinaValida = true;
            }
            if (tipoDeSolda == 3 && lateralSimples == 'Yes') {
                maquinaValida = true;
            }
            if (tipoDeSolda == 4 && fundoRedondo == 'Yes') {
                maquinaValida = true;
            }
            if (tipoDeSolda == 5 && fundo == 'Yes') {
                maquinaValida = true;
            }

            if (tipoDeSolda == 6 && valvulado == 'Yes') {
                maquinaValida = true;
            }

            if (GrupoDoProduto == 2) {
                if (nomeDoGrupo == "7") {
                    maquinaValida = true;
                }
                else {
                    maquinaValida = false;
                }
            }

            if (maquinaValida == true) {

                let sequencia = 1;

                let trocaBobina = ((lastprocess.C1 / 80) * (0.05)); // 3 minutos pra troca de bobina a cada 80Kg - TEM QUE MELHORAR ISSO

                let tempo = (lastprocess.C8 / velocidade) + setupTime + trocaBobina;

                let downTime = setupTime + trocaBobina;
                let upTime = tempo - downTime;

                let custo = tempo * custoHora;

                let unitariosTotal = (lastprocess.C8 * qualidade) / (alturaDaPista / 1000);

                tempvarl.C1 = lastprocess.C1 * qualidade;
                tempvarl.C2 = lastprocess.C2;
                tempvarl.C3 = lastprocess.C3;
                tempvarl.C4 = lastprocess.C4;
                tempvarl.C5 = lastprocess.C5;
                tempvarl.C6 = lastprocess.C6;
                tempvarl.C7 = lastprocess.C7;
                tempvarl.C8 = lastprocess.C8 * qualidade;
                tempvarl.C9 = unitariosTotal;
                tempvarl.cost = custo;

                tempvarl.DownTime = downTime;
                tempvarl.UpTime = upTime;
                tempvarl.IdOrigem = Sequence;
                result.push(tempvarl);
                //console.log("Finishing: ", tempvarl);
                sequencia++;
            }

            //result.push(tempvarl);
        });
    }

    return result;
}

// Get customers by customer Id
var getCustomers = async (req, res) => {
    let query = `select * from customers where Customer=${req.params.customerId}`;
    let finalResult = [];
    database.query(query).then(result => {
        async.forEach(result, function (element, callback) {
            let tempResult = {}
            tempResult['Customer'] = element.Customer.replace(/\s/g, '');
            tempResult['Address'] = element.Address.replace(/\s/g, '');
            tempResult['Neighborhood'] = element.Neighborhood.replace(/\s/g, '');
            tempResult['ZipCode'] = element.ZipCode.replace(/\s/g, '');
            tempResult['City'] = element.City.replace(/\s/g, '');
            tempResult['State'] = element.State.replace(/\s/g, '');
            tempResult['Phone'] = element.Phone.replace(/\s/g, '');
            finalResult.push(tempResult);
        });
        returnResult(res, "Customer data", finalResult);
    });
}

//AdmProcesses
var getAdmProcesses = async (req, res) => {
    await database.query('select * from admprocesses').then(result => {
        if (result.length)
            returnResult(res, 0, result);
        else
            returnResult(res, 1, { "message": "not result found" });
    });
}

var addAdmProcess = async (req, res) => {
    await database.query('INSERT INTO admprocesses(Name,Cost) VALUES(?,?)', [req.body.data.processName, req.body.data.processCost])
        .then(result => {
            res.send({ message: "Added Successfully", result: result, error: 0 });
        })
        .catch(err => {
            res.send({ message: "Add process error", result: err, error: 1 });
        });
}

var updateAdmProcessesStatus = async (req, res) => {
    id = req.body.data.id;
    status = req.body.data.status;
    await database.query('update admprocesses set Status=?  where id=?', [status, id])
        .then(result => {
            res.send({ message: "Status is updated Successfully", result: result, error: 0 });
        })
        .catch(err => {
            res.send({ message: "Update status error", result: err, error: 1 });
        });
}

var editAdmProcesses = async (req, res) => {
    id = req.body.data.processId;
    name = req.body.data.processName;
    cost = req.body.data.processCost;
    await database.query('update admprocesses set Name=?, Cost=?  where id=?', [name, cost, id])
        .then(result => {
            res.send({ message: "Process is updated Successfully", result: result, error: 0 });
        })
        .catch(err => {
            res.send({ message: "Update process error", result: err, error: 1 });
        });
}

var getAdmProcessById = async (req, res) => {
    processId = req.body.data.id;
    await database.query('select * from admprocesses where id=?', [processId])
        .then(result => {
            returnResult(res, 0, result);
        })
        .catch(err => {
            returnResult(res, 1, { "message": "Get Process By Id error" });
        });
}

var getQuotationForBatchSim = async (req) => {
    return new Promise(async (resolve, reject) => {
        let orders = req.Orders;
        let code = req.productCode;
        let quentity = req.Quantity;
        let positions = 'false';

        let query = '';
        let showall = positions;
        let process = {};
        let admProcesses;
        let minimumcost = 0;
        let meachneDetails = {};
        let timeLimit = 0;
        let SumShift = 0;
        let MQuality = {};
        returnreslt = {};

        const combos = require('combos');
        let larguraMaiorImpressora = await getlarguraMaiorImpressora();
        await database.query('select producthead.*,producthead.id as phid,family.* from producthead left join family on producthead.Family=family.FamilyName  where ProductCode=? order by ProcessOrder asc', [code]).then(result => {
            if (result.length == 0) {
                console.log('Result is 0')
                // returnResult(res, 0, { result: [] });
                resolve()
            } else {

                /** Get timelimit for factory*/
                query = 'SELECT (SUM(ShiftA) + SUM(ShiftB) + SUM(ShiftC) + SUM(ShiftD) + SUM(ShiftE)) AS timelimit FROM process';
                database.query(query).then(result => {
                    // console.log('timelimit:', result[0].timelimit)
                    timeLimit = result[0].timelimit;
                }).catch(err => console.log(err))

                /** (Shift A + Shift B + Shift C + Shift D+ Shift E) * Cost [Every Machine]  */
                query = `SELECT SUM(Cost*(ShiftA+ShiftB+ShiftC+ShiftD+ShiftE)) AS SumShift FROM processrecord`;
                database.query(query).then(result => {
                    // console.log('SumShift:', result[0].SumShift)
                    SumShift = result[0].SumShift;
                }).catch(err => console.log(err))

                /** Get Adm Processes */
                query = `SELECT Id, Name, Cost*${orders} AS Cost, Simulation, Status FROM admprocesses WHERE Status='Active'`
                database.query(query).then(result => {
                    // console.log('admprocesses:', result)
                    admProcesses = result;
                }).catch(err => console.log(err))

                async.forEach(result, function (element, callback) {

                    let tempmeachne = []

                    let processname = "";

                    database.query('SELECT processrecord.*,process.MachineName FROM `processrecord` left join process on process.Id=processrecord.ProcessId WHERE `ProcessId`=? and `OnOff`=1', [element.ProcessId]).then(result2 => {
                        async.forEach(result2, function (element2, callback) {
                            tempmeachne.push(element2.Name)
                            machnname = element2.Name;
                            machnname = machnname.replace(/\s/g, '');
                            meachneDetails[machnname] = element2;
                            processname = element2.MachineName
                        });

                        process[processname] = tempmeachne;
                        let processid = {};
                        let newpermulation = [];
                        if (result[result.length - 1]['Id'] == element.Id) {
                            const permutations = combos(process);
                            database.query('SELECT productbody.`ProductCharFatherId`,productbody.`ProductCharChildId`,productbody.`ProductCharChildValue`, productchar1.FamilyMember,productchar1.Disabled,productchar1.GridColumns,productchar1.GridSmColumns,productchar1.Label,productchar2.ProductChildDesc  FROM `productbody` left JOIN productchar1 on productbody.`ProductCharFatherId`=productchar1.`ProductCharFatherId` left JOIN productchar2 on productchar2.`ProductChildId`=productbody.`ProductCharChildId` and productchar1.ProductCharFatherId=productchar2.ProductCharFatherId  WHERE `ProductHeaderID`=?', [result[0].phid]).then(product => {
                                var srnumber = 1;
                                async.forEach(permutations, function (permutation, callback) {
                                    innerpermulation = {};
                                    Totaltime = 0;
                                    TotalCost = 0;
                                    let timecalcalcualtion = true;
                                    let lastProcssvar = [];
                                    let tempQuailty = 1;
                                    Object.keys(permutation).forEach(function (key) {
                                        var meachne = permutation[key];
                                        machnname = meachne.replace(/\s/g, '');
                                        tempQuailty = tempQuailty * (meachneDetails[machnname].Quality / 100);
                                    });


                                    Object.keys(permutation).forEach(function (key) {
                                        var meachne = permutation[key];
                                        machnname = meachne.replace(/\s/g, '');

                                        returnresultobj = MachineReturn(key, meachneDetails[machnname], product, quentity, srnumber, tempQuailty, lastProcssvar, result[0].phid, larguraMaiorImpressora);
                                        lastProcssvar = returnresultobj;
                                        if (returnresultobj.length == 0) {
                                            timecalcalcualtion = false;
                                        }
                                        innerpermulation[key] = { 'name': meachne, 'extraparma': lastProcssvar };

                                        if (lastProcssvar.length == 1) {
                                            timetemp = Totaltime + returnresultobj[0]['UpTime'] + returnresultobj[0]['DownTime'];
                                            Totaltime = parseFloat(timetemp.toFixed(2));
                                            costtemp = TotalCost + returnresultobj[0]['cost'];
                                            TotalCost = parseFloat(costtemp.toFixed(2));
                                        }
                                        if (TotalCost < minimumcost)
                                            minimumcost = TotalCost;

                                    });

                                    if (positions >= 0) {
                                        if (srnumber - 1 == positions) {
                                            returnreslt.Time = parseFloat(Totaltime.toFixed(2));
                                            returnreslt.Cost = parseFloat(TotalCost.toFixed(2));
                                        }
                                    } else {
                                        let insertpath = false;

                                        Object.keys(innerpermulation).forEach(function (key) {

                                            if (innerpermulation[key]['extraparma'].length > 1 && key == 'Extrusion') {
                                                let tempnnuewpath = {};
                                                let innerlextraKey = 0;
                                                let tempht = innerpermulation;
                                                let tempPrintArray = tempht['Printing'] ? tempht['Printing']['extraparma'] : [];
                                                let tempCuttingArray = tempht['Cutting'] ? tempht['Cutting']['extraparma'] : [];
                                                let tempFinishingArray = tempht['Finishing'] ? tempht['Finishing']['extraparma'] : [];
                                                async.forEach(innerpermulation[key]['extraparma'], function (extrapaths, callback) {

                                                    //reinitilize variables
                                                    var entrapathsnew = "";
                                                    var temphtnew = "";
                                                    let Printingcost = 0;
                                                    let Cuttincost = 0;
                                                    let FinishingCost = 0;

                                                    if (tempPrintArray.length > 0) {
                                                        if (tempPrintArray[innerlextraKey]['C1'] == undefined)
                                                            timecalcalcualtion = false;
                                                        Printingcost = tempPrintArray[innerlextraKey]['cost'];
                                                        tempht['Printing']['extraparma'] = tempPrintArray[innerlextraKey];
                                                        // console.log('innerlextraKey', innerlextraKey);
                                                        // console.log(' ');
                                                    } else {

                                                    }
                                                    if (tempCuttingArray.length > 0) {
                                                        if (tempCuttingArray[innerlextraKey]['C1'] == undefined)
                                                            timecalcalcualtion = false;
                                                        Cuttincost = tempCuttingArray[innerlextraKey]['cost'];
                                                        tempht['Cutting']['extraparma'] = tempCuttingArray[innerlextraKey];
                                                    }
                                                    if (tempFinishingArray.length > 0) {
                                                        if (tempFinishingArray[innerlextraKey]['C1'] == undefined)
                                                            timecalcalcualtion = false;
                                                        FinishingCost = tempFinishingArray[innerlextraKey]['cost'];
                                                        tempht['Finishing']['extraparma'] = tempFinishingArray[innerlextraKey];
                                                    }
                                                    innerlextraKey = innerlextraKey + 1;

                                                    // console.log('Array in innerlextraKey =====> ', tempPrintArray);

                                                    var entrapathsoriginal = extrapaths;
                                                    var entrapathsnew = (deepCloning(entrapathsoriginal));

                                                    if (timecalcalcualtion == false) {
                                                        timetemp = Totaltime + entrapathsnew['UpTime'] + entrapathsnew['DownTime'];
                                                        tempht['Time'] = "N/A";
                                                        costtemp = TotalCost + entrapathsnew['cost'];
                                                        tempht['Cost'] = "N/A";
                                                    } else {
                                                        timetemp = Totaltime + entrapathsnew['UpTime'] + entrapathsnew['DownTime'];
                                                        tempht['Time'] = parseFloat(timetemp.toFixed(2));
                                                        costtemp = TotalCost + entrapathsnew['cost'] + Cuttincost + Printingcost + FinishingCost;
                                                        tempht['Cost'] = parseFloat(costtemp.toFixed(2));
                                                    }

                                                    tempht[key]['extraparma'] = entrapathsnew;

                                                    if (entrapathsnew['C1'] == undefined) {
                                                        timecalcalcualtion = false;
                                                    }

                                                    var temphtoriginal = tempht;
                                                    var temphtnew = (deepCloning(temphtoriginal));

                                                    newpermulation.push(temphtnew);

                                                    newpermulation.forEach(print);

                                                    function print(item) {
                                                    }

                                                    insertpath = true;
                                                    srnumber = srnumber + 1;
                                                });
                                            } else {

                                                if (innerpermulation[key]['extraparma'].length == 1) {

                                                    if (innerpermulation[key]['extraparma'][0]['C1'] == undefined)
                                                        timecalcalcualtion = false;

                                                    innerpermulation[key]['extraparma'] = innerpermulation[key]['extraparma'][0];
                                                } else {
                                                    timecalcalcualtion = false;
                                                }
                                            }
                                        });

                                        if (insertpath == false) {
                                            if (timecalcalcualtion == false) {
                                                innerpermulation['Time'] = "N/A";
                                                innerpermulation['Cost'] = "N/A";
                                                newpermulation.push(innerpermulation);
                                                srnumber = srnumber + 1;
                                            } else {
                                                innerpermulation['Time'] = Totaltime;
                                                innerpermulation['Cost'] = TotalCost;
                                                newpermulation.push(innerpermulation);
                                                srnumber = srnumber + 1;
                                            }
                                        }

                                    }
                                });

                                let finalresult = [];
                                let minimumscost = 0;
                                async.forEach(newpermulation, function (temppath, callback) {
                                    let Temptoalacost = 0;
                                    let Temptoalatime = 0;

                                    let tempMixtureCost = temppath['Mixture'] ? temppath['Mixture']['extraparma']['cost'] : 0;
                                    let tempExtrusionCost = temppath['Extrusion'] ? temppath['Extrusion']['extraparma']['cost'] : 0;
                                    let tempPrintingCost = temppath['Printing'] ? temppath['Printing']['extraparma']['cost'] : 0;
                                    let tempCuttingCost = temppath['Cutting'] ? temppath['Cutting']['extraparma']['cost'] : 0;
                                    let tempFinishingCost = temppath['Finishing'] ? temppath['Finishing']['extraparma']['cost'] : 0;
                                    Temptoalacost = tempMixtureCost + tempExtrusionCost + tempPrintingCost + tempCuttingCost + tempFinishingCost;

                                    let tempMixtureUpTime = temppath['Mixture'] ? temppath['Mixture']['extraparma']['UpTime'] : 0;
                                    let tempExtrusionUpTime = temppath['Extrusion'] ? temppath['Extrusion']['extraparma']['UpTime'] : 0;
                                    let tempCuttingUpTime = temppath['Cutting'] ? temppath['Cutting']['extraparma']['UpTime'] : 0;
                                    let tempPrintingUpTime = temppath['Printing'] ? temppath['Printing']['extraparma']['UpTime'] : 0;
                                    let tempFinishingUpTime = temppath['Finishing'] ? temppath['Finishing']['extraparma']['UpTime'] : 0;
                                    let tempMixtureDownTime = temppath['Mixture'] ? temppath['Mixture']['extraparma']['DownTime'] : 0;
                                    let tempExtrusionDownTime = temppath['Extrusion'] ? temppath['Extrusion']['extraparma']['DownTime'] : 0;
                                    let tempPrintingDownTime = temppath['Printing'] ? temppath['Printing']['extraparma']['DownTime'] : 0;
                                    let tempCuttingDownTime = temppath['Cutting'] ? temppath['Cutting']['extraparma']['DownTime'] : 0;
                                    let tempFinishingDownTime = temppath['Finishing'] ? temppath['Finishing']['extraparma']['DownTime'] : 0;
                                    Temptoalatime = tempMixtureUpTime + tempExtrusionUpTime + tempCuttingUpTime + tempPrintingUpTime + tempFinishingUpTime + tempMixtureDownTime + tempExtrusionDownTime + tempCuttingDownTime + tempFinishingDownTime + tempPrintingDownTime;

                                    // let Temptoalacost = temppath['Mixture']['extraparma']['cost'] + temppath['Extrusion']['extraparma']['cost'] + temppath['Printing']['extraparma']['cost'] + temppath['Cutting']['extraparma']['cost'] + temppath['Finishing']['extraparma']['cost'];
                                    // let Temptoalatime = temppath['Mixture']['extraparma']['UpTime'] + temppath['Extrusion']['extraparma']['UpTime'] + temppath['Printing']['extraparma']['UpTime'] + temppath['Cutting']['extraparma']['UpTime'] + temppath['Finishing']['extraparma']['UpTime'];

                                    if (temppath['Cost'] != 'N/A') {
                                        temppath['Cost'] = parseFloat(Temptoalacost.toFixed(2));
                                        temppath['Time'] = parseFloat(Temptoalatime.toFixed(2));
                                    }
                                    if (positions == 'false') {
                                        if (minimumscost == 0 && Temptoalacost) {
                                            minimumscost = Temptoalacost;
                                            temppath['Cost'] = parseFloat(minimumscost).toFixed(2);
                                            temppath['Time'] = parseFloat(Temptoalatime).toFixed(2);
                                            finalresult = [temppath];
                                        }
                                        if (Temptoalacost < minimumscost) {
                                            minimumscost = Temptoalacost;
                                            temppath['Cost'] = parseFloat(minimumscost).toFixed(2);
                                            temppath['Time'] = parseFloat(Temptoalatime).toFixed(2);
                                            finalresult = [temppath];
                                        }
                                    } else {
                                        finalresult.push(temppath);
                                    }
                                });

                                /** Get Formula Cost */
                                query = `SELECT Cost FROM structure WHERE Formula=${Formula}`;
                                database.query(query).then(result => {
                                    formulaCost = result[0].Cost

                                    returnreslt.result = finalresult;
                                    returnreslt.code = code;
                                    returnreslt.quentity = quentity;
                                    returnreslt.minimumcost = minimumcost;

                                    returnreslt.admProcesses = admProcesses;
                                    returnreslt.Formula = formulaCost;
                                    returnreslt.timeLimit = timeLimit;
                                    returnreslt.SumShift = SumShift;

                                    // get one simulation result
                                    finalresult = finalresult[0];
                                    let machineLoadValArray = [];
                                    let totalHourQueryWhereClause = '(';
                                    Object.keys(finalresult).forEach(function (key) {
                                        async.forEach(finalresult[key], async function (el, callback) {
                                            if (typeof el === 'object') {
                                                let { DownTime, UpTime } = el;
                                                let machineLoadVal = 0;
                                                // console.log('keys', key)
                                                machineLoadVal = parseFloat(DownTime.toFixed(2)) + parseFloat(UpTime.toFixed(2))
                                                machineLoadVal = machineLoadVal * parseInt(orders) * 100;
                                                machineLoadValArray.push(machineLoadVal)
                                                totalHourQueryWhereClause += `'${key}',`;
                                            }
                                        })
                                    });
                                    totalHourQueryWhereClause = totalHourQueryWhereClause.slice(0, totalHourQueryWhereClause.length - 1);
                                    totalHourQueryWhereClause += ')';

                                    let totalHourQuery = `SELECT MachineName, ShiftA+ShiftB+ShiftC+ShiftD+ShiftE AS totalHour FROM process WHERE MachineName IN ${totalHourQueryWhereClause}`;
                                    let batchSimTemp = {}

                                    database.query(totalHourQuery).then(result => {
                                        for (let i = 0; i < machineLoadValArray.length; i++) {
                                            let machineLoadVal = 0;
                                            // machine load % = machineLoad/totalHoursOfEachProcess
                                            machineLoadVal = machineLoadValArray[i] / result[i].totalHour;
                                            batchSimTemp[result[i].MachineName] = {
                                                machineLoad: machineLoadVal
                                            }
                                        }

                                        returnreslt.batchSim = batchSimTemp
                                        resolve(returnreslt)
                                    });
                                }).catch(err => console.log(err))

                            });
                        }
                    });
                });
            }
        });
    })
}


var batchSimulation = async (req, res) => {
    let input = req.body.data;
    let result = [];
    for (let i = 0; i < input.length; i++) {
        let data = await getQuotationForBatchSim(input[i])
        result.push(data)
    }
    // console.log('result is', result)
    returnResult(res, 0, result);
}

/** Edit process record */
var getProcess = async (req, res) => {
    database.query('select * from process where id>0').then(result => {
        //console.log(result.length);
        res.send({ result: result, error: 0 });
    });
}

/** Place Order */
var placeOrder = async (req, res, next) => {
    // quotation header query
    let { ICMS, PIS, COFINS, Comission, Shipment, Margin, Price, ProductCode, FormulaCost, FormulaCode, Quantity, DueDate, Client, Login, kg, meter, units } = req.body.headerData;
    let headerSql = `INSERT INTO quotationhead(ICMS, PIS, COFINS, Comission, Shipment, Margin, Price, Quantity, DueDate, Client, LogIn, ProductCode, FormulaCost, FormulaCode, units, meters, Kg) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    let headerData = [ICMS, PIS, COFINS, Comission, Shipment, Margin, Price, Quantity, DueDate, Client, Login, ProductCode, FormulaCost, FormulaCode, units, meter, kg]
    // quotation body query
    let bodySql = `INSERT INTO quotationbody(Process, Time, Cost, HeaderId) VALUES ?`;
    let processData = req.body.bodyData;

    await database.query(headerSql, headerData)
        .then(headerResult => {
            // Save process data
            processData.forEach(element => {
                element.push(headerResult.insertId);
            });

            database.query(bodySql, [processData])
                .then(r => {
                    res.send({ message: "Added Successfully", result: r, error: 0 });
                })
                .catch(e => console.log(e))
        })
        .catch(err => {
            console.log(err)
            res.send({ message: "Add quotation header error", result: err, error: 1 });
        });
}

/** Get all quotation */
var getAllQuotation = async (req, res, next) => {
    let query = `SELECT Id, Login, Client, ProductCode, Quantity, DueDate, Price FROM quotationhead WHERE DateOrder IS NULL`;
    await database.query(query)
        .then(result => {
            returnResult(res, "success", result);
        })
        .catch(err => {
            console.log(err)
        })
}

var getQuotationById = async (req, res) => {
    let query = `SELECT qb.*, qh.ICMS, qh.PIS, qh.COFINS, qh.Comission, qh.Shipment, qh.Margin, qh.FormulaCost, qh.FormulaCode FROM quotationbody qb LEFT JOIN quotationhead qh ON qb.HeaderId=qh.Id WHERE HeaderId=?`;
    await database.query(query, req.params.id)
        .then(result => {
            returnResult(res, "success", result)
        })
        .catch(err => {
            console.log(err)
        })
}

var makeOrder = async (req, res) => {
    let query = `UPDATE quotationhead SET DateOrder=NOW() WHERE Id=?`;
    id = req.body.id;
    await database.query(query, id)
        .then(result => {
            returnResult(res, "success", result)
        })
        .catch(err => {
            console.log(err)
        })
}

/** Get all orders */
var getAllOrders = async (req, res, next) => {
    let query = `SELECT Id, Login, Client, ProductCode, Quantity, DueDate, Price FROM quotationhead WHERE DateOrder IS NOT NULL`;
    await database.query(query)
        .then(result => {
            returnResult(res, "success", result);
        })
        .catch(err => {
            console.log(err)
        })
}

/** Save batch simulation data */
var batchSimulationSave = async (req, res) => {

    let query = `INSERT INTO batchsimulation(Simulation, SimulationName, Orders, ProductCode, Quantity, ICMS, PIS, COFINS, Comission, Shipment, Margin) VALUES ?`;
    let data = req.body.data;
    let SimulationName = req.body.SimulationName;
    // preprocess data
    let newData = [];
    let Simulation = new Date().getTime(); // To get the unique value.
    data.forEach(element => {
        let tempArray = [];
        tempArray.push(Simulation)
        tempArray.push(SimulationName)
        Object.keys(element).forEach(function (key) {
            tempArray.push(element[key]);
        })
        newData.push(tempArray)
    })

    await database.query(query, [newData])
        .then(result => {
            returnResult(res, "success", result);
        })
        .catch(err => {
            console.log(err)
        })
}

/** Get saved batch simulation list */
var getInitBatchSimData = async (req, res) => {
    let orderQuotVal = req.params.orderQuotVal;
    let savedSimQuery = `SELECT DISTINCT Simulation, SimulationName FROM batchsimulation`;
    let orderQuery = `SELECT DISTINCT DATE_FORMAT(DateOrder,'%Y-%m') AS val, DATE_FORMAT(DateOrder,'%Y-%m') AS name FROM quotationhead WHERE DateOrder IS NOT NULL`;
    let quotQuery = `SELECT DISTINCT DATE_FORMAT(DateQuotation,'%Y-%m') AS val, DATE_FORMAT(DateQuotation,'%Y-%m') AS name FROM quotationhead`;
    let orderQuotQuery = orderQuery;
    if (orderQuotVal == 2) {
        orderQuotQuery = quotQuery;
    }
    await database.query(savedSimQuery)
        .then(savedSimData => {
            database.query(orderQuotQuery)
                .then(orderQuotDate => {
                    let result = { savedSimData: savedSimData, orderQuotDate: orderQuotDate }
                    returnResult(res, "success", result)
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })
}

/** Get saved batch simulation data by simulation name */
var getSavedSimulationById = async (req, res) => {
    let id = req.params.id;
    let query = `SELECT * FROM batchsimulation WHERE Simulation=?`
    await database.query(query, id)
        .then(result => {
            returnResult(res, "success", result)
        })
        .catch(err => {
            console.log(err)
        })
}

var getSimulationData = async (req, res) => {
    let query = `SELECT * FROM batchsimulation`;
    await database.query(query)
        .then(result => {
            returnResult(res, "success", result)
        })
        .catch(err => {
            console.log(err)
        })
}

var batchSimulationUpdate = async (req, res) => {
    let data = req.body.data;
    let Simulation = req.body.Simulation;
    let SimulationName = req.body.SimulationName;
    let deleteQuery = `DELETE FROM batchsimulation WHERE Simulation=?`;
    let insertQuery = `INSERT INTO batchsimulation(Simulation, SimulationName, Orders, ProductCode, Quantity, ICMS, PIS, COFINS, Comission, Shipment, Margin) VALUES ?`;
    // preprocess data
    let newData = [];
    data.forEach(element => {
        let tempArray = [];
        tempArray.push(Simulation)
        tempArray.push(SimulationName)
        Object.keys(element).forEach(function (key) {
            tempArray.push(element[key]);
        })
        newData.push(tempArray)
    })

    await database.query(deleteQuery, Simulation)
        .then(deleteResult => {
            database.query(insertQuery, [newData])
                .then(result => {
                    returnResult(res, "success", result);
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })
}

var removeSimulationdata = async (req, res) => {
    let id = req.body.data;
    let query = `DELETE FROM batchsimulation WHERE Id=?`;

    database.query(query, id)
        .then(result => {
            returnResult(res, "success", result)
        })
        .catch(err => {
            console.log(err)
        })
}

var getSavedOrderQuot = async (req, res) => {
    let { selDate, orderQuot } = req.body;
    let query = `SELECT ProductCode, Quantity, ICMS, PIS, COFINS, Comission, Shipment, Margin FROM quotationhead WHERE DateOrder LIKE '%${selDate}%'`;
    if (orderQuot == 2) {
        query = `SELECT ProductCode, Quantity, ICMS, PIS, COFINS, Comission, Shipment, Margin FROM quotationhead WHERE DateQuotation LIKE '%${selDate}%'`;
    }

    await database.query(query)
        .then(result => {
            returnResult(res, "success", result)
        })
        .catch(err => {
            console.log(err)
        })
}

var quantitySimulation = async (req, res) => {
    let quantities = req.body.data;
    let result = [];
    // Orders = 1
    for (let i = 0; i < quantities.length; i++) {
        let input = { Orders: 1, productCode: req.body.productCode, Quantity: quantities[i].Quantity }
        let data = await getQuotationForBatchSim(input)
        result.push(data)
    }
    // console.log('result is', result)
    returnResult(res, 0, result);
}

var updateChart = async (req, res) => {
    console.log('update chart request', req.body.data)
    returnResult(res, 0, "success")
}

var initChart = async (req, res) => {
    console.log('init chart');
    let nodes = [
        { id: 0, name: "COMPRESSED AIR", title: "US$ 56,000.00", img: "https://www.plantengineering.com/wp-content/uploads/sites/4/2017/06/PLE1706_WEB_IMG_Stellar_ManufacturingPlan.jpg", label: "text" },
        { id: 1, pid: 0, name: "PRESSES", title: "1", img: "http://www.polusautomacao.com.br/wp-content/uploads/2017/09/5-1.jpg", label: "text" },
        { id: 2, pid: 0, name: "PLASMA CUTTING", title: "2", img: "http://www.polusautomacao.com.br/wp-content/uploads/2017/09/5-1.jpg", label: "text" },
        { id: 3, pid: 0, name: "PAINTING", title: "3", img: "http://www.polusautomacao.com.br/wp-content/uploads/2017/09/5-1.jpg", label: "text" },
        { id: 4, pid: 1, name: "MAC 1", title: "4", img: "http://litoralplataformas.com.br/imagens/equipamentos/empilhadeira.jpg", label: "text" },
        { id: 5, pid: 1, name: "MAC 2", title: "5", img: "http://litoralplataformas.com.br/imagens/equipamentos/empilhadeira.jpg", label: "text" },
        { id: 6, pid: 1, name: "MAC 3", title: "6", img: "http://litoralplataformas.com.br/imagens/equipamentos/empilhadeira.jpg", label: "text" },
        { id: 7, pid: 2, name: "MAC 1", title: "7", img: "http://litoralplataformas.com.br/imagens/equipamentos/empilhadeira.jpg", label: "text" },
        { id: 8, pid: 3, name: "MAC 1", title: "8", img: "http://litoralplataformas.com.br/imagens/equipamentos/empilhadeira.jpg", label: "text" },
        { id: 9, pid: 3, name: "MAC 2", title: "9", img: "http://litoralplataformas.com.br/imagens/equipamentos/empilhadeira.jpg", label: "text" },
    ]
    returnResult(res, 0, nodes)
}


// init product form by product code
var initFormByProductCode = async (req, res) => {
    let returnVal = []
    var Family = "";
    database.query('SELECT Label,ProductCharFatherId,FamilyMember FROM productchar1').then(result => {
        database.query('SELECT * FROM productchar2 order by ProductCharFatherId').then(result2 => {
            result.forEach(element => {
                let tempResult = { label: '', type: '', name: '', options: [] }; // labe, type, name, value, text
                dropdownStart = false;
                tempResult['label'] = element.Label;
                result2.forEach(element2 => {
                    if (element.ProductCharFatherId == element2.ProductCharFatherId) {
                        if (element.FamilyMember == 1) {
                            Family = element2.ProductChildNickName;
                        } else {
                            Family = 'NOFAMILY';
                        }
                        if (element2.ProductChildId == 0) {
                            tempResult['type'] = 'input';
                            tempResult['name'] = `ProductCharFatherId-input-${element.ProductCharFatherId}-${Family}`
                        } else {
                            if (!dropdownStart) {
                                selectOption = {};
                                tempResult['type'] = 'select';
                                tempResult['name'] = `ProductCharFatherId-select-${element.ProductCharFatherId}`
                                selectOption['text'] = '--Select--';
                                selectOption['value'] = 0;
                                tempResult['options'].push(selectOption);
                                dropdownStart = true;
                            }
                            selectOption = {};
                            let tempValue = `${element2.ProductChildId}_${Family}`;
                            let tempText = element2.ProductChildDesc
                            selectOption['text'] = tempText;
                            selectOption['value'] = tempValue;
                            tempResult['options'].push(selectOption);
                        }
                    }
                });
                returnVal.push(tempResult)
            });
            // push product code form
            let tempResult = { label: '', type: '', name: '', options: [] }; // labe, type, name, value, text
            tempResult['label'] = 'Product Code';
            tempResult['type'] = 'input';
            tempResult['name'] = 'ProductCode';
            returnVal.push(tempResult)
            res.json(returnVal)
        });
    });
};


// Save product with product code
var productSaveWithProductCode = async (req, res) => {
    let formdata = req.body.raw;
    let ProductCode = formdata['ProductCode'];
    let Family = 'NOFAMILY';
    let noformfields = ["ProductCode", "Family"];
    // res.json({ message: 'Saved successfully!', error: 0, result: ProductCode })
    database.query('INSERT INTO producthead(ProductCode,Family) VALUES(?,?)', [ProductCode, Family])
        .then(result => {
            // console.log('producthead is inserted', result)
            let ProductHeaderID = result.insertId;
            let Finalproductcode = "";

            Object.keys(formdata).forEach(key => {
                let fieldName = key;
                if (noformfields.indexOf(fieldName) < 0) {
                    let filedNameArray = fieldName.split("-");
                    if (filedNameArray[1] == "select")
                        optionvalue = formdata[key].split("_");

                    let ProductCharChildId = filedNameArray[1] == "select" ? optionvalue[0] : 0;
                    let val = formdata[key] == '' ? 0 : formdata[key];
                    let ProductCharChildValue = filedNameArray[1] == "select" ? 0 : val;

                    Finalproductcode += (filedNameArray[1] == "select" && val != 0 && optionvalue[1] != "NOFAMILY") ? optionvalue[1] : "";
                    Finalproductcode += (filedNameArray[1] != "select" && val != '' && filedNameArray[3] != "NOFAMILY") ? filedNameArray[3] : "";

                    database.query('INSERT INTO productbody(ProductHeaderID,ProductCharFatherId,ProductCharChildId,ProductCharChildValue) VALUES(?,?,?,?)',
                        [ProductHeaderID, filedNameArray[2], ProductCharChildId, ProductCharChildValue])
                        .then(result => {
                            // console.log('productbody data is saved', result)
                        })
                        .catch(err => res.json({ message: 'Oops, error occured!', error: 1, result: err }));
                }
            })
            database.query('update producthead set Family=? where Id=?', [Finalproductcode, ProductHeaderID])
                .then(result => {
                    res.json({ message: 'Saved successfully!', error: 0, result: result });
                })
                .catch(err => res.json({ message: 'Oops, error occured!', error: 1, result: err }));
        })
        .catch(err => res.json({ message: 'Oops, error occured!', error: 1, result: err }));
};


// init product form by quantity
var initFormByQuantity = async (req, res) => {
    let returnVal = []
    var Family = "";
    database.query('SELECT Label,ProductCharFatherId,FamilyMember FROM productchar1').then(result => {
        database.query('SELECT * FROM productchar2 order by ProductCharFatherId').then(result2 => {
            result.forEach(element => {
                let tempResult = { label: '', type: '', name: '', options: [] }; // labe, type, name, value, text
                dropdownStart = false;
                tempResult['label'] = element.Label;
                result2.forEach(element2 => {
                    if (element.ProductCharFatherId == element2.ProductCharFatherId) {
                        if (element.FamilyMember == 1) {
                            Family = element2.ProductChildNickName;
                        } else {
                            Family = 'NOFAMILY';
                        }
                        if (element2.ProductChildId == 0) {
                            tempResult['type'] = 'input';
                            tempResult['name'] = `ProductCharFatherId-input-${element.ProductCharFatherId}-${Family}`
                        } else {
                            if (!dropdownStart) {
                                selectOption = {};
                                tempResult['type'] = 'select';
                                tempResult['name'] = `ProductCharFatherId-select-${element.ProductCharFatherId}`
                                selectOption['text'] = '--Select--';
                                selectOption['value'] = 0;
                                tempResult['options'].push(selectOption);
                                dropdownStart = true;
                            }
                            selectOption = {};
                            let tempValue = `${element2.ProductChildId}_${Family}`;
                            let tempText = element2.ProductChildDesc
                            selectOption['text'] = tempText;
                            selectOption['value'] = tempValue;
                            tempResult['options'].push(selectOption);
                        }
                    }
                });
                returnVal.push(tempResult)
            });
            // push quantity form
            let tempResult = { label: '', type: '', name: '', options: [] }; // labe, type, name, value, text
            tempResult['label'] = 'Quantity';
            tempResult['type'] = 'input';
            tempResult['name'] = 'quantity';
            returnVal.push(tempResult)
            res.json(returnVal)
        });
    });
};

// Save product with quantity
var productSaveWithQuantity = async (req, res, next) => {
    let formdata = req.body.raw;
    let ProductCode = new Date().getTime();
    let Family = 'NOFAMILY';
    let noformfields = ["ProductCode", "Family", "quantity"];
    let quantity = formdata.quantity

    // quotation api parameters
    let quotationAPIParams = {}
    quotationAPIParams["params"] = {};
    quotationAPIParams.params["code"] = ProductCode;
    quotationAPIParams.params["quentity"] = quantity;
    quotationAPIParams.params["positions"] = 'false';

    // res.json({ message: 'Saved successfully!', error: 0, result: quantity })
    database.query('INSERT INTO producthead(ProductCode,Family) VALUES(?,?)', [ProductCode, Family])
        .then(result => {
            // console.log('producthead is inserted', result)
            let ProductHeaderID = result.insertId;
            let Finalproductcode = "";

            Object.keys(formdata).forEach(key => {
                let fieldName = key;
                if (noformfields.indexOf(fieldName) < 0) {
                    let filedNameArray = fieldName.split("-");
                    if (filedNameArray[1] == "select")
                        optionvalue = formdata[key].split("_");

                    let ProductCharChildId = filedNameArray[1] == "select" ? optionvalue[0] : 0;
                    let val = formdata[key] == '' ? 0 : formdata[key];
                    let ProductCharChildValue = filedNameArray[1] == "select" ? 0 : val;

                    Finalproductcode += (filedNameArray[1] == "select" && val != 0 && optionvalue[1] != "NOFAMILY") ? optionvalue[1] : "";
                    Finalproductcode += (filedNameArray[1] != "select" && val != '' && filedNameArray[3] != "NOFAMILY") ? filedNameArray[3] : "";

                    database.query('INSERT INTO productbody(ProductHeaderID,ProductCharFatherId,ProductCharChildId,ProductCharChildValue) VALUES(?,?,?,?)',
                        [ProductHeaderID, filedNameArray[2], ProductCharChildId, ProductCharChildValue])
                        .then(result => {
                            // console.log('productbody data is saved', result)
                        })
                        .catch(err => res.json({ message: 'Oops, error occured!', error: 1, result: err }));
                }
            })
            database.query('update producthead set Family=? where Id=?', [Finalproductcode, ProductHeaderID])
                .then(result => {
                    // console.log('call quotation api', ProductCode, Finalproductcode)
                    // res.json({ message: 'Saved successfully!', error: 0, result: result });
                    // Call quotation API
                    getQuotations(quotationAPIParams, res, next)
                })
                .catch(err => res.json({ message: 'Oops, error occured!', error: 1, result: err }));
        })
        .catch(err => res.json({ message: 'Oops, error occured!', error: 1, result: err }));
};

module.exports = {
    getQuotations,
    getProcessMeachne,
    updateProcessrecord,
    updateMachineStatus,
    processStatusUpdate,
    processSave,
    getProcessid,
    processUpdate,
    addProcessrecord,
    getProcessRecord,
    getProcessRecordByid,
    getCustomers,
    getAdmProcesses,
    addAdmProcess,
    updateAdmProcessesStatus,
    getAdmProcessById,
    editAdmProcesses,
    batchSimulation,
    getProcess,
    placeOrder,
    getAllQuotation,
    getQuotationById,
    makeOrder,
    getAllOrders,
    batchSimulationSave,
    getInitBatchSimData,
    getSavedSimulationById,
    getSimulationData,
    batchSimulationUpdate,
    removeSimulationdata,
    getSavedOrderQuot,
    quantitySimulation,
    updateChart,
    initChart,
    initFormByProductCode,
    productSaveWithProductCode,
    initFormByQuantity,
    productSaveWithQuantity,
};

