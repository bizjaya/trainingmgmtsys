const mongoose = require('mongoose');
const { MONGO } = require('../const/dbs');
const { decimal2JSON } = require('../helper/helpers');
const { Schema } = mongoose;


const CourseSchema = new mongoose.Schema(
    {
      
      // MId:{ type: Schema.Types.ObjectId, ref: MONGO.MEMUSER, required: true, immutable: true },
      CourseName: { type: String, default: '' },
      Subject: { type: [String], default: [] },
      Type: { type: String, default: '' },
      Createdate: { type: Schema.Types.Date, default: ''},
      Updatedate: { type: Schema.Types.Date, default: ''},
      ModifiedBy :{ type: String, default: '' }

    },
    { collation: { locale: 'en', strength: 2 }, strict: true }
  );
  
  CourseSchema.set('toJSON', {
    transform: (doc, ret) => {
      decimal2JSON(ret);
      return ret;
    },
  });
  
  module.exports.CourseMng = mongoose.model(
    MONGO.COURSE,
    CourseSchema,
    MONGO.COURSE
  );

