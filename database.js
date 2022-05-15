const mysql = require('mysql');

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Inf0rmatica-98',
    database:'dbproduct'
});

module.exports = db