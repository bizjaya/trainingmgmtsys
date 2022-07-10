const express = require('express');
const { MongoPaging, MongoFormat } = require('../const/paging');
const router = express.Router();
const { ToSqlDT, ToEpoch } = require('../helper/helpers');
const { CourseMng } = require('../schema/courseschm');
const { MONGO } = require('../const/dbs');
const authorize = require('../helper/auth');
const Role = require('../helper/role');

router.get('/getall', getall); // all training
router.post('/create', (req, res, next) => authorize(req, res, next, [Role.Admin, Role.User]), createcourse); // all training
router.get('/bysubject', filterbysubject); // all training
router.get('/bystream', filterbystream); // all training
router.get('/bytype', filterbytype); // all training

async function createcourse(req, rep, next) {
  try {
    let cmd = { ...req.body };
    const { MId } = req.user;

    let sub = {};

    sub.CourseName = cmd.CourseName;
    sub.Subject = cmd.Subject;
    sub.Type = cmd.Type;
    sub.Createdtdate = ToSqlDT();
    sub.Updatedate = ToSqlDT();
    sub.ModifiedBy = MId;

    const ndata = new CourseMng({ ...sub });
    const data = await ndata.save();
    rep.send(data);
  } catch (err) {
    rep.status(400).send(err);
  }
}

async function getall(req, rep, next) {
  try {
    const training = await CourseMng.find({});
    rep.send(training);
  } catch (err) {
    console.log(err);
    rep.status(400).send(err);
  }
}

async function filterbysubject(req, rep, next) {
  let { subject } = req.query;
  try {
    let found = await CourseMng.aggregate(
      //   { $match: { Subjects: 'English' } },
      //   // { $project: { "training": '$CourseName' } },
      //   {
      //   $project: {
      //     "training" : "$CourseName",
      //     "subject" : {
      //       $in: [ "English", "$Subject" ]
      //     }
      //   }
      // }
      [{ $match: { $expr: { $in: [subject, '$Subject'] } } }]
    );

    return rep.send(found);
  } catch (err) {
    console.log(err);
    rep.status(400).send(err);
  }
}

async function filterbystream(req, rep, next) {
  try {
    let { stream } = req.query;

    let found = await CourseMng.aggregate([
      {
        $lookup: {
          from: MONGO.SUBJECT,
          let: {
            // 'subj': '$Subject',
            'strm': stream,
          },
          pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$Stream', '$$strm'] }] } } }],
          as: 'subject',
        },
      },
      { '$unwind': '$subject' },
      { '$match': { $expr: { $in: ['$subject.Subjects', '$Subject'] } } },
      {
        '$group': {
          _id: '$_id',
          CourseName: { $first: '$CourseName' },
          Subject: { $first: '$Subject' },
          Type: { $first: '$Type' },
          Updatedate: { $first: '$Updatedate' },
          ModifiedBy: { $first: '$ModifiedBy' },
          Createdate: { $first: '$Createdate' },
        },
      },
    ]);

    return rep.send(found);
  } catch (err) {
    console.log(err);
    rep.status(400).send(err);
  }
}

async function filterbytype(req, rep, next) {
  try {
    let { type } = req.query;

    let found = await CourseMng.aggregate([
      // { $match: { Type: 'Basic' } },
      // { $group: { Training: '$CourseName' } },
      {
        $match: {
          Type: type,
        },
      },
      {
        $project: {
          'training': '$CourseName',
        },
      },
    ]);

    return rep.send(found);
  } catch (err) {
    console.log(err);
    rep.status(400).send(err);
  }
}

module.exports = router;
