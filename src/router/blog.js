
let { 
    getList, 
    getDetail,
    newBlog,
    updateBlog, 
    deleteBlog } = require('../controller/blog');
let { SuccessModel,  ErrorModel } = require('../model/resModel')

let loginCheck = (req) => {
    if(!req.session.username){
        return Promise.resolve(new ErrorModel('尚未登录')); 
    }
}

let handleBlogRouter = (req, res) => {
    let method = req.method;
    let id = req.query.id || '';
    // 获取博客列表
    if(method === 'GET' && req.path === "/api/blog/list"){
        let author = req.query.author || '';
        let keyword = req.query.keyword || '';
        if (req.query.isadmin) {
            // 管理员界面
            let loginCheckResult = loginCheck(req);
            if(loginCheckResult){
                return loginCheckResult
            }
            // 强制查询自己的博客
            author = req.session.username
        }
        let result = getList(author, keyword);
        return result.then( listData => {
            return new SuccessModel( listData )
        })
    }

    // 获取博客详情
    if(method === 'GET' && req.path === "/api/blog/detail"){
        let result = getDetail(id);
        return result.then(data => {
            return new SuccessModel(data);
        })
    }

     // 新建博客
    if(method === 'POST' && req.path === "/api/blog/new"){
        let loginCheckResult = loginCheck(req);
        if(loginCheckResult){
            return loginCheckResult
        }
        // let author = 'zhuxingchao'
        req.body.author = req.session.username;
        let result = newBlog(req.body);
        return result.then(data => {
            return new SuccessModel(data);
        })
    }
    
    // 更新博客
    if(method === 'POST' && req.path === "/api/blog/update"){
        let loginCheckResult = loginCheck(req);
        if(loginCheckResult){
            return loginCheckResult
        }
        let result = updateBlog(id, req.body);
        return result.then(value => {
            if(value){
                return new SuccessModel(value);
            }else{
                return new ErrorModel(value);
            }
        })
    }
    
    // 删除博客
    if(method === 'POST' && req.path === "/api/blog/del"){
        let loginCheckResult = loginCheck(req);
        if(loginCheckResult){
            return loginCheckResult
        }
        let author = req.session.username
        let result = deleteBlog(id, author);
        return result.then(res =>{
            if(res){
                return new SuccessModel(res);
            }else{
                return new ErrorModel(res);
            }
        })
    }

}


module.exports = handleBlogRouter;