
const jwt= require('jsonwebtoken');
const RES=require('../RES');
const db=require('../../database/conn');
const dbUsers= require('../../database/dbUsers')(RES,db);

const verifyUser=(user,cb)=>{
  let passHash=generateHash(String(user.pass));
  dbUsers.authUser(user, (err, userDB)=> {
    if(err) cb(err);
    else if(!userDB) cb(0,'NO_REGISTER');
    else if( user.username.toUpperCase()==userDB.username.toUpperCase()
              && passHash==userDB.pass){
         // userDB.pass=user.pass;
        console.log('el user DB que se hara token',userDB)
        cb(0, objAuth(userDB), userDB);
    }else cb(0,'BAD_LOGIN')
  });
}

const objAuth=(user, expiresIn = 60*60*3)=>{
  user = JSON.parse(JSON.stringify(user));
  return ({
    token: jwt.sign(user, process.env.JWT_KEY, { expiresIn }),
    expire_at: new Date().getTime() + 1000 * expiresIn
  })
}

const decodeToken=(token,cb)=>{
  jwt.verify(token, process.env.JWT_KEY, cb);
}  


const generateHash=(pass)=>{
  return jwt.sign(pass, process.env.JWT_KEY_PASS);
}


exports.objAuth=objAuth;
exports.decodeToken=decodeToken;
exports.verifyUser=verifyUser;
exports.generateHash=generateHash;

