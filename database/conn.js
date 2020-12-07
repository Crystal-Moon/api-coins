
module.exports=(mysql)=>{

  const pool={
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE,
    multipleStatements: true,
    connectionLimit: 20,
    charset: 'UTF8MB4'
  }

  const db = mysql.createPool(pool);

  return {
    pool: db,
    status: ()=> new Promise((done,fail)=>{ db.getConnection((err, conn)=> {
      if(err) fail(JSON.stringify(e)); else{ conn.release(); done() } })
    })
  }
}
