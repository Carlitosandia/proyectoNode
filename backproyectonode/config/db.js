const mysql = require('mysql2');
const util = require('util');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'CaJaRe2018?',
    database: 'proyectonode'
});

pool.query = util.promisify(pool.query);
module.exports = pool;