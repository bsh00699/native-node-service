let MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'myblog',
    port: 3306,
    // charset: 'utf8mb4'
}

let REDIS_CONF = {
    port: 6379,
    host: '192.168.25.1',
}

module.exports ={
    MYSQL_CONF,
    REDIS_CONF
}