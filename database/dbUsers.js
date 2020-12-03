
const db = require('./conn');
const { db_error }=require('../util/RES');

const getConn=()=>new Promise((done,fail)=>{ db.getConnection((err,conn)=>{
  if(err) fail(new db_error(err,'NOT_CONECTION')); else done(conn) })
});

const authUser = (user,cb)=>{
 let c=0;
 getConn().then(conn=>{ c=conn;
    conn.query(`SELECT id, name, last_name, username, pass, currency, lang 
      FROM users WHERE username=?`,[user.username],(e,data)=>{  
      if(e) cb(new db_error(e))
      else cb(0,data[0]); 
    });
 })
 .catch(e=>cb(e))
 .finally(()=>c.release())
}

const saveUser = (user, cb)=> {
/*  user.name=user.name.trim();
  if(user.name[0]) user.name=user.name[0].toUpperCase()+user.name.slice(1);
  user.last_name=user.last_name.trim();
  if(user.last_name[0]) user.last_name=user.last_name[0].toUpperCase()+user.last_name.slice(1);
*/
 let c=0;
 getConn().then(conn=>{ c=conn;
    conn.query('INSERT INTO users SET ?;',[user], (e,d)=>{
      if(e) cb(new db_error(e));
      else cb(0,d.insertId);
    });
 })
 .catch(e=>cb(e))
 .finally(()=>c.release())
}

exports.saveUser=saveUser;
exports.authUser=authUser;






/////////////////////////////////////////////////////////////////////////7----------------------------------


/*

const getCodeVerity = (code,cb)=>{
 let c=0;
 getConn().then(conn=>{ c=conn;
  conn.query(`SELECT id, name, last_name, email, username, pass, concat(name,' ',last_name) as fullName, 
      ban, fb_id, ggl_id, lang, hash_active FROM users WHERE hash_active like '${code}%' 
      AND register_date > date_sub(now(),interval 20 minute) ORDER BY id DESC;`,[],(e,data)=>{
    if(e) cb(new db_error(e));
    else if(data.length==0) cb(0,'CODE_REGISTER_BAD');
    else {
      let time= parseInt(data[0].hash_active.split('#')[1]);
      if(new Date().getTime() - 132000 > time) cb(0,'CODE_REGISTER_EXPIRED'); //132000 = 2.2 minutos
      else cb(0,0,data[0]);
    } 
  });
 })
 .catch(e=>cb(e))
 .finally(()=>c.release())
}

const activeUser= (id,cb)=>{
 let c=0;
 getConn().then(conn=>{ c=conn;
  conn.query(`UPDATE users SET is_active=true WHERE id=?;`,id, e=>{
    cb(e? new db_error(e) : 0)
  });
 })
 .catch(e=>cb(e))
 .finally(()=>c.release())
}

const refreshCode=(user,code,cb)=>{
 authUser(user,(er,u)=>{
  if(er) cb(er);
  else if(!u) cb(0,'NO_REGISTER');
  else getConn().then(conn=>{
    u.active=code;
    console.log('el codigo nuevo ',u.active);
    conn.query(`UPDATE users SET hash_active=?, register_date=now() WHERE id=?;`,[code.hash,u.id],e=>{ 
      conn.release();
      cb(e? new db_error(e) : 0, u) 
    });
  })
  .catch(e=>cb(e))
 })
}



const oneChangePass=(id,cb)=>{
 let c=0;
 getConn().then(conn=>{ c=conn;
    conn.query(`SELECT id, date_pass, now() as ahora FROM users WHERE id=?;
          UPDATE users SET date_pass=null WHERE id=?;`,[id,id],(e,data)=>{
      if(e) cb(new db_error(e));
      else if(data[0].length==0) cb(null,'NO_REGISTER');
      else cb(null,data[0][0]); 
    });
 })
 .catch(e=>cb(e))
 .finally(()=>c.release())
}

exports.getCodeVerity=getCodeVerity;
exports.activeUser=activeUser;
exports.refreshCode=refreshCode;



exports.oneChangePass=oneChangePass;

*/