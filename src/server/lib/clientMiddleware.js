// const { Client } = require('./vdap');
const CDAP = require('promised-ldap');
const asyncHandler = require('../lib/asyncHandler');

// const client = Client.create({
//   url: 'ldap://localhost:1389'
// });

module.exports = {
  createClient: (req, res, next) => {
    req.client = new CDAP({
      url: 'ldap://127.0.0.1:1389'
    });
    next();
  },
  bindClient: asyncHandler(async (req, res, next) => {
    // console.log(req.headers.bindcredentials);
    if (!req.headers.bindcredentials) {
      res.status(400).json({
        message: 'Both username and password must be provided'
      });
      return;
    }

    const username = req.headers.bindcredentials.split(':')[0];
    const password = req.headers.bindcredentials.split(':')[1];

    await req.client.bind(username, password);

    req.user = username;

    next();
  }),
  unbindClient: asyncHandler(async (req, res, next) => {
    await req.client.unbind();
    next();
  })
};
