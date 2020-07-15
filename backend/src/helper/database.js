import { createConnection } from 'mysql';

class Database {
    constructor(config) {
        this.connection = createConnection(config);
        this.connection.connect(function (err) {
            if (err) throw err;
            console.log("DB is connected");
        });
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

export default Database;
