
const db = require('./conn');
const { db_error }=require('../util/RES');

const getConn=()=>new Promise((done,fail)=>{ db.getConnection((err,conn)=>{
  if(err) fail(new db_error(err,'NOT_CONECTION')); else done(conn) })
});

const authUser = (user,cb)=>{
 let c=0;
 getConn().then(conn=>{ c=conn;
    conn.query(`SELECT id, name, last_name, username, pass, prefer_currency, prefer_top, lang 
      FROM users WHERE username=?`,[user.username],(e,data)=>{  
      if(e) cb(new db_error(e))
      else cb(0,data[0]); 
    });
 })
 .catch(e=>cb(e))
 .finally(()=>c.release())
}

const saveUser = (user, cb)=> {
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

const updateUser = (user, cb)=>{
 let c=0;
 getConn().then(conn=>{ c=conn;
    conn.query(`UPDATE users SET ? WHERE id=?`,[user, user.id], e=> { cb(e? new db_error(e) : 0) });
 })
 .catch(e=>cb(e))
 .finally(()=>c.release())
}

const addCoin = ({ id_user, id, name, symbol, image },cb)=>{
 let c=0;
 getConn().then(conn=>{ c=conn;
    conn.query(`INSERT INTO users_coins (id_user, id_coin, name, symbol, image) 
        SELECT * FROM (SELECT ? as id_u, ? as id_c, ? as n_c, ? as s_c, ? as i_c) AS tmp
        WHERE NOT EXISTS (SELECT id_user FROM users_coins WHERE id_user=? AND id_coin=?) LIMIT 1;`,
      [ id_user, id, name, symbol, image, id_user, id_coin ], (e,data)=> {
      if(e) cb(new db_error(e))
      else cb(0,data.insertId); 
    });
 })
 .catch(e=>cb(e))
 .finally(()=>c.release())
}

const getCoins = (id_user, cb)=>{
 let c=0;
 getConn().then(conn=>{ c=conn;
    conn.query(`SELECT id_coin as id, symbol, name, image 
      FROM users_coins WHERE id_user=? AND is_erase=false`,[id_user], (e,data)=> {
      cb(e? [] : data);
    });
 })
 .catch(e=>cb(e))
 .finally(()=>c.release())
}

const deleteCoin = (id_user, cb)=>{
 let c=0;
 getConn().then(conn=>{ c=conn;
    conn.query(`UPDATE users_coins SET is_erase=true WHERE id_coin=? AND id_user=?`,[id_coin, id_user])
    cb();
 })
 .catch(e=>cb(e))
 .finally(()=>c.release())
}

exports.saveUser=saveUser;
exports.authUser=authUser;
exports.updateUser=updateUser;

exports.addCoin=addCoin;
exports.getCoins=getCoins;
exports.deleteCoin=deleteCoin;
