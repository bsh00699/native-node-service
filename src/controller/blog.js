let { execute } = require('../db/mysql')
let getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 ` // where 1=1 是为了防止参数全部为空， 后面拼接 order by createtime desc 语句
    if(author){
        sql += `and author='${author}' ` // 语句后面加一个空格 也是为了拼接 sql 语句
    }
    if(keyword){
        sql += `and title like='%${keyword}%' `
    }
    sql += 'order by createtime desc;'
    // 返回的是一个 promise 对象
    return execute(sql)
} 

let getDetail = (id) => {
    let sql = `select * from blogs where id='${id}';`
    return execute(sql).then(rows => {
        return rows[0]
    })
} 

let newBlog = (data) => {
    let title = data.title;
    let content = data.content;
    let createTime = Date.now();
    let author = data.author;
    let sql = `
        insert into blogs(title, content, createtime, author)
        values ('${title}', '${content}', '${createTime}', '${author}')
    `
    return execute(sql).then(data => {
        return { id: data.insertId }
    })
} 

let updateBlog = (id, blogData = {}) => {
    let title = blogData.title;
    let content = blogData.content;
    let sql = `update blogs set title='${title}', content='${content}' where id='${id}';`
    return execute(sql).then(res => {
        console.log('更新结果', res)
        if(res.affectedRows > 0){
            return true
        }
        return false
    })
} 

let deleteBlog = (id, author) => {
    let sql = `delete from blogs where id='${id}' and author='${author}';`
    return execute(sql).then(res => {
        console.log('删除结果', res)
        if(res.affectedRows > 0){
            return true
        }
        return false
    })
} 

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}