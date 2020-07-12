var express = require('express');
var router = express.Router();

const route = (app) => {
    app.use('/', router);

    router.get('/', function (req, res, next) {
        res.send('Welcome to Nordy REST API');
    });
};

module.exports = route;