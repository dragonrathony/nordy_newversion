import database from '../config/db';

const processController = {
    get(req, res) {
        database.query('SELECT * FROM ind_process').then(result => {
            //console.log(result.length);
            res.send({ result: result, error: 0 });
        });
    }

};

export default processController;
