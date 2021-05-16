
let { execute } = require('../db/mysql')
let login = (userName, password) => { 
    let sql = `select username, realname from users where username='${userName}' and password='${password}';`
    return execute(sql).then(rows => {
        return rows[0] || {}
    })
}
module.exports = login;