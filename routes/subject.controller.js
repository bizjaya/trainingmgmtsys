const express = require('express');
const router = express.Router();
const { Flip, ToSqlDT, ToEpoch } = require('../helper/helpers');
const { MongoPaging, MongoFormat } = require('../const/paging');
const { SubjMng } = require('../schema/subschm');
const authorize = require('../helper/auth');
const Role = require('../helper/role');

router.get('/getall', getsubject); // all training
router.post('/create', (req, res, next) => authorize(req, res, next, [Role.Admin, Role.User]), createsubject); // all training

async function getsubject(req, rep, next) {
  const { limit, skip, where, sort } = MongoPaging(req.query);

  try {
    let found = await SubjMng.aggregate([
      { $match: { ...where } },
      { $sort: sort },
      {
        '$facet': {
          count: [{ $count: 'total' }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    let dat = await MongoFormat(found[0], req.query);
    rep.send(dat);
  } catch (err) {
    console.log(err);
    rep.status(400).send(err);
  }
}

async function createsubject(req, rep, next) {
  try {
    let cmd = { ...req.body };
    const { MId } = req.user;

    let sub = {};

    sub.Subjects = cmd.Subjects;
    sub.Stream = cmd.Stream;
    sub.Createdtdate = ToSqlDT();
    sub.Updatedate = ToSqlDT();
    sub.ModifiedBy = MId;

    // rep.send(cmd);
    // return;

    const ndata = new SubjMng({ ...sub });
    const data = await ndata.save();
    rep.send(data);
  } catch (err) {
    rep.status(400).send(err);
  }
}

module.exports = router;
