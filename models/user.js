const mongoose = require('mongoose');
const crypto = require('crypto');
const {"v1": uuidv1} = require('uuid');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim:true,
    maxlength:32
  },
  email: {
    type: String,
    required: true,
    trim:true,
    unique: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  about: {
    type: String
  },
  salt:String,
  role: {
    type: Number,
    default: 0
  },
  history:{
      type:Array,
      default:[]
  }
},{timestamps:true});

//virtual field
userSchema.virtual('password')
.set(function(password){
    this._password = password
    this.salt = uuidv1()
    this.hashed_password = this.encryptedPassword(password)
}).get(function(){
    return this._password
});

userSchema.methods={

    authenticate: function(plainText) {
        return this.encryptedPassword(plainText) === this.hashed_password;
    },

    encryptedPassword:function(password){
        if(!password) return '';
        try{
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
        }catch{
           return ''
        }
    }
}

module.exports = mongoose.model('user', userSchema);

