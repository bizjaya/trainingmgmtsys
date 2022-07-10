// const jwt = require('jsonwebtoken');
// const jwt = require('express-jwt');
// const { expressjwt: jwt } = require('express-jwt');
const jwt = require('jsonwebtoken');

const { secret } = require('../config.json');

// function authorize(req, res, next) {
//   console.log(req.headers)
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]

//   if (token == null) return res.sendStatus(401)

//   jwt.verify(token, secret, (err, user) => {
//     console.log(err)

//     if (err) return res.sendStatus(403)

//     req.user = user

//     next()
//   })
// }

console.log(secret);

function authorize(req, res, next, roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])

  // console.log(req, res, next, roles);
  if (typeof roles === 'string') {
    roles = [roles];
  }
  console.log(roles);

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === undefined) return res.status(401).json({ message: 'Unauthorized' });

  // console.log(token);
  // if (token == null) return res.sendStatus(401);

  //  (req, res, next)=>{

  //  }

  jwt.verify(token, secret, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    // console.log(user);

    if (roles.length && !roles.includes(user.Role)) {
      // user's role is not authorized
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  });

  // return [
  //   // authenticate JWT token and attach user to request object (req.user)
  //   jwt({ secret, algorithms: ['HS256'] }),

  //   // authorize based on user role
  //   () => {
  //     console.log('wtf');
  //     // return res.status(401).json((req));

  //     const authHeader = req.headers['authorization'];
  //     const token = authHeader && authHeader.split(' ')[1];

  //     console.log(authHeader);

  //     if (roles.length && !roles.includes(req.user?.role)) {
  //       // user's role is not authorized
  //       return res.status(401).json({ message: 'Unauthorized' });
  //     }

  //     // authentication and authorization successful
  //     next();
  //   },
  // ];
}

module.exports = authorize;
