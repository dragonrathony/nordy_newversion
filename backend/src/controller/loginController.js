import database from '../config/db';

const loginController = {
    login(req, res) {
        console.log("login information====>", req.body);

        let parms = [req.body.username, req.body.password];
        let query = 'SELECT * FROM users WHERE username=? and password=?';
        // console.log('asdf', database)
        database.query(query, parms)
            .then(result => {
                res.send(result)
            })
            .catch(err => {
                res.send(err)
            })
    }
};

export default loginController;
