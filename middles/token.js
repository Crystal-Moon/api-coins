const express = require('express');
//const Responsee=require('../controls/validation/plantillaResponse');
const RES=require('../controls/util/RES');
const router = express.Router();
const auth=require('../controls/validation/authorization')

router.use((req,res,next)=>{
    if(!req.headers.authorization && !req.headers.Authorization) {
      console.log('no hay token')
      res.status(401).send(new RES.e400(401,[{reason:'Invalid token', message:'Not found authorization property'}]));
    }else{
      let auto= req.headers.Authorization || req.headers.authorization;

      let t=auto.replace('Bearer ','');
      auth.decodeToken(t,(e,user)=>{
        if(e||!user.id) {
            console.log('token roto')
            res.status(401).send(new RES.e400(401,[e]));
        }else{
            req.id=user.id;
            req.who=user;
            req.lang= (user.lang)? user.lang.toLowerCase() : 'es' ;
            req.who.fullName = req.who.fullName? req.who.fullName
                : (req.who.name ? (req.who.name+' '+req.who.last_name)
                : req.who.username);
            req.who.is_active= user.is_active===undefined? true : user.is_active; //no me acuerdo porq lo necesitaba XD
            next();
        }
    });
    }
});

module.exports = router;
