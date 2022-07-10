const { MONGO } = require('../const/dbs');
const mongoose = require('mongoose');
const { decimal2JSON } = require('../helper/helpers');
// const { Schema } = mongoose;
var Schema = mongoose.Schema;



const MemUserSchema = new mongoose.Schema(
    {

      Fname: { type: String, required: true, default: '' },
      Lname: { type: String, required: true, default: '' },
      Uname: { type: String, required: true, default: '' },
      Pswd:{type: String, required: true, default: ''},
      Role:{type: String, required: true, default: ''},

    },
    { collation: { locale: 'en', strength: 2 }, strict: true }
  );
  
  
  MemUserSchema.set('toJSON', {
    transform: (doc, ret) => {
      decimal2JSON(ret);
      return ret;
    },
  });
  
  module.exports.MemUser = mongoose.model(MONGO.MEMUSER, MemUserSchema, MONGO.MEMUSER);