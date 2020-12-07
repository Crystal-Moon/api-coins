
module.exports = (RULES)=>{

  return {
    verifyFields : async(rule, obj, lang='es') => {
      try {
        let r = RULES[rule];

        for(let k in obj) {
  	      if(typeof obj[k] != r[k].type) throw `${k.toUpperCase()}: use '${r[k].type}'`;

          let badFormat = await r[k].format(obj[k],lang);
  	      if(badFormat) throw `${k.toUpperCase()}: ${badFormat[lang] || badFormat}`;
        }

        return false;
      }catch(error) { return error }
    }
  }
}
