//const E400=require('./bank400');

module.exports= (E400)=>{
  return {
  ok: class {
    constructor(status, data={}, type='object') {
      this.success = true;
		  this.status_code = status;
      this.payload_type = type;
		  this.payload = data;
		  this.error = null;
    }
  },

  e400: class {
    constructor(status, code, l='es', add='') {
      this.success = true;
		  this.status_code = status;
      this.payload_type = 'object';
		  this.payload = null;
		  this.error = { code, message: add + E400[code][l] };
    }
  },

  error: class {
    constructor(e) {
      this.success = false;
		  this.status_code = 500;
      this.payload_type = 'object';
		  this.payload = null;
		  this.error = e;
    }
  },

  db_error: class{
    constructor(e,a){
      this.reason= a||'DB_ERROR';
      this.message='[--Fatal error--]';
      this.message_nerd=JSON.stringify(e);
      console.log('DB_ERROR',e);
    }
  }
}
}