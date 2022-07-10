const mongoose = require('mongoose');
const { MONGO } = require('../const/dbs');
const { decimal2JSON } = require('../helper/helpers');
const { Schema } = mongoose;


const SubjectSchema = new mongoose.Schema(
    {
      // MId:{ type: Schema.Types.ObjectId, ref: MONGO.MEMUSER, required: true, immutable: true },
      Subjects: { type: String, default: '' },
      Stream: { type: String, default: '' },
      Createdtdate: { type: Schema.Types.Date, default: ''},
      Updatedate: { type: Schema.Types.Date, default: ''},
      ModifiedBy :{ type: String, default: '' }

    },
    { collation: { locale: 'en', strength: 2 }, strict: true }
  );
  
  SubjectSchema.set('toJSON', {
    transform: (doc, ret) => {
      decimal2JSON(ret);
      return ret;
    },
  });
  
  module.exports.SubjMng = mongoose.model(
    MONGO.SUBJECT,
    SubjectSchema,
    MONGO.SUBJECT
  );

