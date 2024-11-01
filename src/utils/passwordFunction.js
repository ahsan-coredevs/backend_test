const bcrypt = require('bcrypt');
module.exports.encryptPassword = async (password,) => { 
    return await bcrypt.hash(password, 8) ;

}


module.exports.decryptPassword = async (password, hash) => { 
    return await bcrypt.compare(password,hash) ;

}