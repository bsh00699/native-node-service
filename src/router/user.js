let login = require('../controller/user');
let { SuccessModel,  ErrorModel } = require('../model/resModel')
let {set} = require('../db/redis')

let handleUserRouter = (req, res) => {
    let method = req.method;
    // 获取博客列表
    if(method === 'POST' && req.path === "/api/user/login"){
        let { userName, password } = req.body;
        // let { userName, password } = req.query;
        let result = login(userName, password)
        return result.then(data => {
            if(data.username){
                // 设置 session
                req.session.username = data.username;
                req.session.realname = data.realname;
                // 同步到redis
                set(req.sessionId, req.session)
                console.log('session data', req.session)
                return new SuccessModel(); 
            }
            return new ErrorModel('登录失败');
        })  
    }

    // if(method = 'GET' && req.path === "/api/user/login-test"){
    //     if(req.session.username){
    //         return Promise.resolve(new SuccessModel( {
    //             session: req.session
    //         }
    //         )); 
    //     }
    //     return Promise.resolve(new ErrorModel('尚未登录')); 
    // }

}

// let getCookieExpires = () => {
//     let time = new Date()
//     time.setTime(time.getTime() + 24 * 3600 * 1000)
//     return time.toGMTString()
// }

module.exports = handleUserRouter;