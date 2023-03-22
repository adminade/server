const mysql = require('mysql');

//创建数据连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'my_db_01',
})

const dbUser = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'server',
})


//暴露，谁想用 就调用db
module.exports = {
    db: db,
    dbUser: dbUser
};