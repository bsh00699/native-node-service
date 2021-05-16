let crypto = require('crypto');


// 密匙
let SECRET_KEY = 'DHGjit123';

// md5 加密
function md5(data){
    let md5 = crypto.createHash('md5');
    return md5.update(data).digest('hex');
}

function encryptPassword(password){
    let encryptData = `password=${password}&key=${SECRET_KEY}`
    return md5(encryptData);
}

module.exports = {
    encryptPassword
}