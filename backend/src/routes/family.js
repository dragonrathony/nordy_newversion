var express = require('express'),
    router = express.Router();

var { getFamilyByid, getFamily, familyUpdate } = require("../controller/queries/family");


router.get('/api/getFamily',getFamily);
router.get('/api/getFamilyByid/:id',getFamilyByid);
router.post('/api/familyUpdate',familyUpdate);

module.exports = router;
