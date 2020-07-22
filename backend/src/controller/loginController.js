import database from '../config/db';
import returnResult from '../helper/result';

const loginController = {
    login(req, res) {
        let parms = [req.body.username, req.body.password];
        let query = 'SELECT * FROM users WHERE username=? and password=?';

        database.query(query, parms)
            .then(result => {
                if (result.length == 0) {
                    returnResult(res, 'Invalid credentials!', []);
                }
                returnResult(res, 'Login success!', result[0]);
            })
            .catch(err => {
                returnResult(res, 'Login failed!', err);
            });
    }
};

export default loginController;
