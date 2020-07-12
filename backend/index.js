import express from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
require('dotenv').config();

var app = express();
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

import routes from './src/routes';
app.use('/', routes());

// //process api
// app.post('/backend/familysave', (req, res) => {
//   FamilyName = req.body.raw.FamilyName;
//   familyProcess = req.body.raw.familyProcess;
//   ProcessOrder = 1;
//   database.query('select * from family where FamilyName=?', [FamilyName]).then(result => {
//     //console.log(result.length);
//     if (result.length > 0) {
//       res.send({ message: "Name already exists", error: 1 });
//     } else {
//       //find id of process
//       database.query('select * from process').then(result2 => {
//         async.forEach(result2, function (element, callback) {
//           //get id of process
//           ProcessOrder = 0;
//           async.forEach(familyProcess, function (familyProcesselement, callback) {
//             ProcessOrder = ProcessOrder + 1;
//             if (familyProcesselement == element.MachineName) {
//               ProcessOrder = familyProcess.indexOf(element.MachineName);
//               ProcessOrder = ProcessOrder + 1;
//               database.query('INSERT INTO family(FamilyName,ProcessId,ProcessOrder) VALUES(?,?,?)', [FamilyName, element.Id, ProcessOrder]).then(result => {


//               });

//             }
//           });
//         });

//         res.send({ message: "Added Successfully", error: 0 });
//       });

//     }

//   });

// });


// var FamilyRouter = require("./backend/routes/family");
// app.use('/', FamilyRouter);

// var ProcessRouter = require("./backend/routes/process");
// app.use('/', ProcessRouter);


const port = process.env.PORT || 8080;
app.listen(port, (err) => {
  if (err) {
    console.log("Server running error", err)
  }
  console.log(`Server listening on port: ${port}`)
});