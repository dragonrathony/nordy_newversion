var express = require('express'),
    router = express.Router();

var { getQuotations, getProcessMeachne, processStatusUpdate,
    updateMachineStatus, processSave, getProcessid, processUpdate,
    addProcessrecord, getProcessRecord, getProcessRecordByid,
    updateProcessrecord, getCustomers, getAdmProcesses,
    addAdmProcess, updateAdmProcessesStatus, getAdmProcessById,
    editAdmProcesses, batchSimulation, getProcess, placeOrder,
    getAllQuotation, getQuotationById, makeOrder,
    getAllOrders, batchSimulationSave, getInitBatchSimData,
    getSavedSimulationById, getSimulationData, batchSimulationUpdate,
    removeSimulationdata, getSavedOrderQuot,
    quantitySimulation, updateChart, initChart,
    initFormByQuantity, productSaveWithQuantity,
    initFormByProductCode, productSaveWithProductCode } = require("../controller/queries/process");


router.post('/api/updatePrcoessStatus', processStatusUpdate);
router.post('/api/updateMachineStatus', updateMachineStatus);
router.post('/api/processSave', processSave);
router.post('/api/processUpdate', processUpdate);
router.get('/api/getProcessByid/:id', getProcessid);
router.post('/api/addProcessrecord', addProcessrecord);
router.get('/api/getProcessRecord/:id', getProcessRecord);
router.get('/api/getProcessRecordByid/:id', getProcessRecordByid);
router.post('/api/updateProcessrecord', updateProcessrecord);
router.get('/api/getProcessMeachne', getProcessMeachne);
router.get('/api/getQuotations/:code/:quentity/:positions?', getQuotations);
router.get('/api/getCustomer/:customerId', getCustomers);
/** adm processes route */
router.get('/api/getAdmProcesses', getAdmProcesses);
router.post('/api/addAdmProcess', addAdmProcess);
router.post('/api/updateAdmProcessesStatus', updateAdmProcessesStatus);
router.post('/api/editAdmProcesses', editAdmProcesses);
router.post('/api/getAdmProcessById', getAdmProcessById);
/** Batch simulation route */
router.post('/api/batchSimulation', batchSimulation);
router.post('/api/batchSimulationSave', batchSimulationSave);
router.get('/api/getInitBatchSimData/:orderQuotVal', getInitBatchSimData);
router.get('/api/getSavedSimulationById/:id', getSavedSimulationById);
router.post('/api/getSavedOrderQuot', getSavedOrderQuot);
/** Edit Process Record */
router.get('/api/getProcess', getProcess);
/** Qutation Condition PlaceOrder */
router.post('/api/placeOrder', placeOrder);
/** Quotation */
router.get('/api/getAllQuotation', getAllQuotation);
router.get('/api/getQuotationById/:id', getQuotationById);
router.post('/api/makeOrder', makeOrder);
/** Orders */
router.get('/api/getAllOrders', getAllOrders);
/** Get simulation list */
router.get('/api/getSimulationData', getSimulationData);
router.post('/api/batchSimulationUpdate', batchSimulationUpdate);
router.post('/api/removeSimulationdata', removeSimulationdata)
/** Quantity simulation */
router.post('/api/quantitySimulation', quantitySimulation);
/** Update chart */
router.get('/api/initChart', initChart);
router.post('/api/updateChart', updateChart);
/** Form tab in addQuotation */
router.get('/api/initFormByQuantity', initFormByQuantity)
router.post('/api/productSaveWithQuantity', productSaveWithQuantity)
/** Add product */
router.get('/api/initFormByProductCode', initFormByProductCode)
router.post('/api/productSaveWithProductCode', productSaveWithProductCode)


module.exports = router;
