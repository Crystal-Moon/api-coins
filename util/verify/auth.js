
module.exports = (jwt,dbUsers)=>{

 const generateHash=(pass)=>{
   return jwt.sign(pass, process.env.JWT_KEY_PASS);
 }

 const objAuth=(user, expiresIn = 60*60*3)=>{
  user = JSON.parse(JSON.stringify(user));
  return ({
    token: jwt.sign(user, process.env.JWT_KEY, { expiresIn }),
    expire_at: new Date().getTime() + 1000 * expiresIn
  })
 }

 return {
  objAuth,
  generateHash,
  verifyUser:(user,cb)=>{
    let passHash=generateHash(String(user.pass));
    dbUsers.authUser(user, (err, userDB)=> {
      if(err) cb(err);
      else if(!userDB) cb(0,'NO_REGISTER');
      else if( user.username.toUpperCase()==userDB.username.toUpperCase()
              && passHash==userDB.pass){
        cb(0, objAuth(userDB), userDB);
      }else cb(0,'BAD_LOGIN')
    });
  },

  decodeToken:(token,cb)=>{
    jwt.verify(token, process.env.JWT_KEY, cb);
  }
 }
}
