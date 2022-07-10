const express = require('express');
const router = express.Router();
const { secret } = require('../config.json');
const jwt = require('jsonwebtoken');
const Role = require('../helper/role');
const { Flip, ToSqlDT, ToEpoch } = require('../helper/helpers');
const { MemUser } = require('../schema/memuser');
const crypto = require('crypto');
const authorize = require('../helper/auth');

router.post('/auth', authenticate); // public route
router.post('/create', (req, res, next) => authorize(req, res, next, Role.Admin), createUser); // admin only
// router.get('/:id', authorize(), getById);       // all authenticated users

async function authenticate(req, rep, next) {
  try {
    let cmd = { ...req.body };
    // console.log(cmd);
    // rep.send(cmd);
    // return;

    const exist = await MemUser.exists({ Uname: cmd.Uname });
    // console.log(exist);
    // rep.send(exist);
    // return;
    if (!exist) return rep.send({ error: `Member ${cmd.Uname} doesn't exist` });
    let user = await MemUser.findOne({ Uname: cmd.Uname });
    // rep.send(user);
    // return;
    cmd.Pswd = crypto.createHash('md5').update(cmd.Pswd).digest('hex');
    // console.log(cmd.Pswd);
    // console.log(user.Pswd);
    // rep.send(cmd.Pswd);
    // return;

    if (user.Pswd == cmd.Pswd) {
      let token = jwt.sign({ Uname: user.Uname, MId: user._id.valueOf(), Role: user.Role }, secret, { expiresIn: '1800s' });
      rep.send(token);
    } else res.send(403, 'Authentication failed! Invalid password');

    // rep.send(user);
  } catch (err) {
    rep.status(400).send(err);
  }
}

async function createUser(req, rep, next) {
  try {
    let cmd = { ...req.body };

    const user = await MemUser.findOne({ Uname: cmd.Uname });
    if (user == null) return rep.send({ error: `Member ${cmd.Uname} already exists` });

    // if (MId !== user.MId && MemUser.Role !== 'Admin') {
    //   return res.status(401).json({ message: 'Unauthorized' });
    // }

    let usr = {};
    usr.Uname = cmd.Uname;
    usr.Fname = cmd.Fname;
    usr.Lname = cmd.Lname;
    usr.Role = cmd.Role;

    //   console.log(cmd);
    //   rep.send(cmd);
    //   return;

    usr.Pswd = crypto.createHash('md5').update(cmd.Pswd).digest('hex');

    // rep.send(usr.Pswd);
    // console.log(usr.Pswd);
    // return;

    const nuser = new MemUser({ ...usr });
    const u = await nuser.save();

    rep.send(u);
  } catch (err) {
    rep.status(400).send(err);
  }
}

module.exports = router;
