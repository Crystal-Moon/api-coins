
const jwt= require('jsonwebtoken');
const dbUsers= require('../../database/dbUsers');
//const ctrlMails=require('../util/ctrlMails');

const verifyUser=(user,cb)=>{
  //user.username=user.email  //dejar asi
  let passHash=generateHash(String(user.pass));
  dbUsers.authUser(user, (err, userDB)=> {
    if(err) cb(err);
    else if(!userDB) cb(0,'NO_REGISTER');
    //else if(userDB.ban) cb(null,'BAN');
    //else if(!userDB.is_active) cb(null,'NO_ACTIVE');
    else if( user.username.toUpperCase()==userDB.username.toUpperCase()
              && passHash==userDB.pass){
         // userDB.pass=user.pass;
        console.log('el user DB que se hara token',userDB)
        cb(0, objAuth(userDB), userDB);
    }else cb(0,'BAD_LOGIN')
  });
}

const objAuth=(user, expiresIn = 60*60*24)=>{
  user = JSON.parse(JSON.stringify(user));
  return ({
    token: jwt.sign(user, process.env.JWT_KEY, { expiresIn }),
    expire_at: new Date().getTime() + 1000 * expiresIn
  })
}

const decodeToken=(token,cb)=>{
  //let er=null;
  jwt.verify(token, process.env.JWT_KEY, cb);
}  


const generateHash=(pass)=>{
  return jwt.sign(pass, process.env.JWT_KEY_PASS);
}

/*
const generateCode=()=>{
  let code=String(Math.trunc(Math.random()*(999999-100001)+100001));
  let hoy=new Date().getTime();
  return ({ code:code, hash:code+'#'+String(hoy), expire_at: hoy+1000*60*2.2 });  //2.2 minutos
} 
*/

const decodeCode=(token,cb)=>{
  dbUsers.getCodeVerity(token,(err,fail,userDB)=>{
    if(err) cb(err);
    else if(fail) cb(0,fail);
    else{
      let p0=new Promise((done,fail)=>{ dbUsers.activeUser(userDB.id, e=>{ if(e) fail(e); else done() }) });
      let p1=new Promise((done,fail)=>{ dbUser.getUser(userDB.id,0,(e,u)=>{ if(e) fail(e); else done(u) }) });
      let p2=new Promise((done,fail)=>{ done(objAuth(userDB)) });
  
      Promise.all([p0,p1,p2])
      .then(pp=>{ cb(0,0,{ auth: pp[2], profile: pp[1] }, userDB) })
      .catch(e=> cb(e));
    }
  });
}

const mailCode=(user,again,cb)=>{
  const deep= decodeURIComponent(user.deep);
  console.log('el deep para el correo de code',deep);
  let p=new Promise(async(done,fail)=>{
    if(!again) done(user);
    else dbUsers.refreshCode(user, await generateCode(), (e,u)=>{if(e) fail(e); else done(u) });
  })

  p.then(dat=>{
    if(dat=='NO_REGISTER') cb(0,dat);
    else{
      let email={ 
        to: dat.email, 
        theme: 'code',
        lang: dat.lang, 
        vars: {
          link: deep, //si o si usar 'link',
          email: dat.active.code //si o si el segundo se llama 'email'
        }
      }

      delete dat.active.hash;
      delete dat.hash_active;
      
      //ctrlMails.sendEmail(email, (e)=>{ cb(e,dat) }); //funciona bien
      cb(null,dat);
    }
  }).catch(e=>{ 
console.log('e en mailCode',e)
    cb(e) });
}

exports.objAuth=objAuth;
//exports.encodeToken=encodeToken;
exports.decodeToken=decodeToken;
//exports.diyAccessToken=diyAccessToken;

exports.verifyUser=verifyUser;
exports.generateHash=generateHash;

//exports.generateCode=generateCode;
exports.decodeCode=decodeCode;
exports.mailCode=mailCode;