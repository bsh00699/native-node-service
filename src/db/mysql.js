let mysql = require('mysql')
let { MYSQL_CONF } = require('../config/db')

let con = mysql.createConnection(MYSQL_CONF)

// 开始连接
con.connect();

// 执行SQL语句
function execute(sql){
    let promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if(err){
                console.error('执行 sql 失败', err)
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise
}

module.exports = {
    execute
}

// alter user 'root'@'localhost' identified with mysql_native_password by 'admin';
// flush privileges;