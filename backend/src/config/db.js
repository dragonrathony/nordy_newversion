import { createConnection } from 'mysql';
require('dotenv').config();

const DB_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

class Database {
  constructor(DB_CONFIG) {
    this.connection = createConnection(DB_CONFIG);
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

export default new Database(DB_CONFIG);
