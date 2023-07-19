import mysql from 'mysql2';
import autoBind from 'auto-bind';

export class ConnectToDb {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      database: 'lakashirdetesek',
      host: '127.0.0.1',
      port: 3306,
      user: 'webprogleim2041',
      password: 'kicsikutyatarka',
    });
    autoBind(this);
  }

  executeQuery(query, options = []) {
    return new Promise((resolve, reject) => {
      this.pool.query(query, options, (err, results) => {
        if (err) {
          reject(new Error(`Error while running '${query}: $ ${err}'`));
        } else {
          resolve(results);
        }
      });
    });
  }
}

export default new ConnectToDb();
