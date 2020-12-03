const express = require('express');
const router = express.Router();

const RES=require('../util/RES');
const auth=require('../util/verify/auth');

router.use((req,res,next)=>{
  if(!req.headers.authorization && !req.headers.Authorization)
    res.status(401).send(new RES.e400(401,'NO_TOKEN','es'));
  else{
    let auto= req.headers.Authorization || req.headers.authorization;
    let t=auto.replace('Bearer ','');
    auth.decodeToken(t,(e,user)=>{
      if(e||!user.id) res.status(401).send(new RES.e400(401,'BAD_TOKEN','es'));
      else{
        req.id=parseInt(user.id);
        req.who=user;
        req.lang= (user.lang)? user.lang.toLowerCase() : 'es' ;
        next();
      }
    });
  }
});

module.exports = router;
