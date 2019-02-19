const ldap = require('ldapjs');
// const { readDb, saveDb } = require('./lowdbMiddleware');
const storagebe = require('./storagebeMiddleware');
const Blockchain = require('./bcMiddleware');

// /--- Shared handlers

function authorize(req, res, next) {
  /* Any user may search after bind, only cn=root has full power */
  const isSearch = req instanceof ldap.SearchRequest;
  if (!req.connection.ldap.bindDN.equals('cn=root') && !isSearch) {
    return next(new ldap.InsufficientAccessRightsError());
  }

  req.originalUser = 'cn=root';

  return next();
}

// /--- Globals

const SUFFIX = 'o=example';
const server = ldap.createServer();

server.bind('cn=root', (req, res, next) => {
  if (req.dn.toString() !== 'cn=root' || req.credentials !== 'secret') {
    return next(new ldap.InvalidCredentialsError());
  }

  res.end();
  return next();
});

// server.bind(SUFFIX, readDb, (req, res, next) => {
//   const dn = req.dn.toString();
//   const { db } = req;
//   if (!db[dn]) return next(new ldap.NoSuchObjectError(dn));

//   if (!db[dn].userpassword) return next(new ldap.NoSuchAttributeError('userPassword'));

//   if (db[dn].userpassword.indexOf(req.credentials) === -1) {
//     return next(new ldap.InvalidCredentialsError());
//   }

//   res.end();
//   return next();
// });

// server.compare(SUFFIX, authorize, readDb, (req, res, next) => {
//   const dn = req.dn.toString();
//   const { db } = req;
//   if (!db[dn]) return next(new ldap.NoSuchObjectError(dn));

//   if (!db[dn][req.attribute]) return next(new ldap.NoSuchAttributeError(req.attribute));

//   let matches = false;
//   const vals = db[dn][req.attribute];
//   for (let i = 0; i < vals.length; i++) {
//     if (vals[i] === req.value) {
//       matches = true;
//       break;
//     }
//   }

//   res.end(matches);
//   return next();
// });

server.add(SUFFIX, authorize, storagebe.add, Blockchain.record('add'));

server.del(SUFFIX, authorize, storagebe.del, Blockchain.record('add'));

server.modify(SUFFIX, authorize, storagebe.modify, Blockchain.record('modify'));

server.search(SUFFIX, authorize, storagebe.search);

// /--- Fire it up

server.listen(1389, () => {
  console.log('LDAP server up at: %s', server.url);
});

module.exports = server; // Export for testing
