let redis = require('redis')

let { REDIS_CONF } = require('../config/db')

let redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', err => {
    console.log(err)
})

function set(key, val){
    if(typeof val === 'object'){
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get(key){
    let promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if(err){
                reject(err)  
                return
            }
            if(val == null){
                resolve(null)
                return
            }
            try {
                resolve(
                    JSON.parse(val)
                )
            } catch (error) {
                resolve(val)
            }
        })
    })
    return promise
}

module.exports = {
    set,
    get
}