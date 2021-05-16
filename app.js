'use strict'
var querystring = require('querystring');
let http = require('http');
let PORT = 8000;
let handleBlogRouter = require('./src/router/blog');
let handleUserRouter = require('./src/router/user');
const { get, set } = require('./src/db/redis')
// let SESSION_DATA = {};
let getCookieExpires = () => {
    let time = new Date()
    time.setTime(time.getTime() + 24 * 3600 * 1000)
    return time.toGMTString()
}

// 处理postData
let getPostData = (req) => {
    let promise = new Promise((resolve, reject) => {
        if(req.method !== 'POST'){
            resolve({})
            return
        }
        if(req.headers['content-type'] !== 'application/json'){
            resolve({})
            return
        }
        let postData = '';
        req.on('data', chunk =>{
            postData += chunk.toString();
        })
        req.on('end', () =>{
            if(postData === ''){
                resolve({})
                return
            }
            resolve( JSON.parse(postData))
        })

    })
    return promise
}
let serverHandle = (req, res) => {
    // 设置返回数据格式
    res.setHeader('Content-type', 'application/json');
    let url = req.url;
    req.path = url.split('?')[0];
    req.query = querystring.parse(url.split('?')[1]);
    // 解析cookie
    req.cookie = {};
    let cookieStr = req.headers.cookie || '';
    cookieStr.split(';').forEach(element => {
        if(!element){
            return
        }
        let arr = element.split('=');
        let key = arr[0].trim();
        let value = arr[1].trim();
        req.cookie[key] = value;

    });
    // // 解析 session
    // let needSetCookie = false;
    // let userId = req.cookie.userId;
    // if(userId){
    //     if(!SESSION_DATA[userId]){
    //         console.log('SESSION_DATA[userId] 为空')
    //         SESSION_DATA[userId] = {};
    //     }
    // }else{
    //     needSetCookie = true;
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {};
    // }
    // console.log('SESSION_DATA[userId] 值++', SESSION_DATA[userId])
    // req.session = SESSION_DATA[userId]
    // console.log(' req.session 值++', req.session)
    // 解析 session （使用 redis）
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 redis 中的 session 值
        set(userId, {})
    }
    // 获取 session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, {})
            // 设置 session
            req.session = {}
        } else {
            // 设置 session                                          
            req.session = sessionData
        }
        // 处理 post data
        return getPostData(req)
    })
    .then(postData => {
        req.body = postData;
        // 处理blog路由
        let blogRes = handleBlogRouter(req, res);  // 返回的是一个 promise 对象
        if(blogRes){
            blogRes.then( blogData => {
                if(needSetCookie){
                    res.setHeader('Set-Cookie', `username='${userId}'; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end( JSON.stringify( blogData ) )
            })
            return
        }
        // 处理user路由
        let userRes = handleUserRouter(req, res);
        if(userRes){
            userRes.then( userData => {
                if(needSetCookie){
                    res.setHeader('Set-Cookie', `username='${userId}'; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end( JSON.stringify( userData ) )
            })
            return
        }
        // not found 404
        res.writeHead(404, {"content-type": "text/plain"})
        res.write('404 Not Found\n')
        res.end()
    })
    // // 处理post 形式传入的data
    // getPostData(req).then(postData => {
    //     req.body = postData;
    //     // 处理blog路由
    //     let blogRes = handleBlogRouter(req, res);  // 返回的是一个 promise 对象
    //     if(blogRes){
    //         blogRes.then( blogData => {
    //             if(needSetCookie){
    //                 res.setHeader('Set-Cookie', `username='${userId}'; path=/; httpOnly; expires=${getCookieExpires()}`)
    //             }
    //             res.end( JSON.stringify( blogData ) )
    //         })
    //         return
    //     }
    //     // 处理user路由
    //     let userRes = handleUserRouter(req, res);
    //     if(userRes){
    //         userRes.then( userData => {
    //             if(needSetCookie){
    //                 res.setHeader('Set-Cookie', `username='${userId}'; path=/; httpOnly; expires=${getCookieExpires()}`)
    //             }
    //             res.end( JSON.stringify( userData ) )
    //         })
    //         return
    //     }
    //     // not found 404
    //     res.writeHead(404, {"content-type": "text/plain"})
    //     res.write('404 Not Found\n')
    //     res.end()
    // })
}
let server = http.createServer(serverHandle);
server.listen(PORT);
console.log('OK')
// module.exports = serverHandle;
