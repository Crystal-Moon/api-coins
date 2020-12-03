const mysql = require('mysql');
const GO = require('../util/GO');

const pool={	//final
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
/*
const pool={	//local
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kik',
    port: 3306,
    multipleStatements: true,
    connectionLimit: 20
}
*/

const db = mysql.createPool(pool);

//conexion de prueba
db.getConnection((err, conn)=> {
  if(err) console.log('No se pude crear conexion.',err.toString())
  else
    conn.query('SELECT 1 + 1 AS conected', error => {
      if (error) console.log('Problemas de conexion con mysql');
      else{ 
        console.log('Database status: Se inicio conexion');
        conn.release();
      }
    });
});

GO('ping')
.then(ok => console.log('CoinGecko status: OK!'))
.catch(e => console.log('CoinGecko status: Some Error', JSON.stringify(e)))

module.exports=db;
