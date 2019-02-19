const ldap = require('ldapjs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const database = low(adapter);
database.defaults({}).write();

// /--- Shared handlers

function authorize(req, res, next) {
  /* Any user may search after bind, only cn=root has full power */
  const isSearch = req instanceof ldap.SearchRequest;
  if (!req.connection.ldap.bindDN.equals('cn=root') && !isSearch) return next(new ldap.InsufficientAccessRightsError());

  return next();
}

// /--- Globals

const SUFFIX = 'o=example';
const server = ldap.createServer();

server.bind('cn=root', (req, res, next) => {
  if (req.dn.toString() !== 'cn=root' || req.credentials !== 'secret') return next(new ldap.InvalidCredentialsError());

  res.end();
  return next();
});

server.add(SUFFIX, authorize, (req, res, next) => {
  console.log(`DN: ${req.dn.toString()}`);

  const dn = req.dn.toString();

  const db = database.getState();
  if (db[dn]) return next(new ldap.EntryAlreadyExistsError(dn));
  db[dn] = req.toObject().attributes;

  // console.log(db);

  database.setState(db);
  database.write();

  res.end();
  return next();
});

server.bind(SUFFIX, (req, res, next) => {
  const dn = req.dn.toString();
  const db = database.getState();
  if (!db[dn]) return next(new ldap.NoSuchObjectError(dn));

  if (!db[dn].userpassword) return next(new ldap.NoSuchAttributeError('userPassword'));

  if (db[dn].userpassword.indexOf(req.credentials) === -1) {
    return next(new ldap.InvalidCredentialsError());
  }

  res.end();
  return next();
});

server.compare(SUFFIX, authorize, (req, res, next) => {
  const dn = req.dn.toString();
  const db = database.getState();
  if (!db[dn]) return next(new ldap.NoSuchObjectError(dn));

  if (!db[dn][req.attribute]) return next(new ldap.NoSuchAttributeError(req.attribute));

  let matches = false;
  const vals = db[dn][req.attribute];
  for (let i = 0; i < vals.length; i++) {
    if (vals[i] === req.value) {
      matches = true;
      break;
    }
  }

  res.end(matches);
  return next();
});

server.del(SUFFIX, authorize, (req, res, next) => {
  const dn = req.dn.toString();
  const db = database.getState();
  if (!db[dn]) return next(new ldap.NoSuchObjectError(dn));

  delete db[dn];
  database.setState(db);
  database.write();
  res.end();
  return next();
});

server.modify(SUFFIX, authorize, (req, res, next) => {
  const dn = req.dn.toString();
  const db = database.getState();
  if (!req.changes.length) return next(new ldap.ProtocolError('changes required'));
  if (!db[dn]) return next(new ldap.NoSuchObjectError(dn));

  const entry = db[dn];

  for (let i = 0; i < req.changes.length; i++) {
    const mod = req.changes[i].modification;
    switch (req.changes[i].operation) {
      case 'replace':
        if (!entry[mod.type]) return next(new ldap.NoSuchAttributeError(mod.type));

        if (!mod.vals || !mod.vals.length) {
          delete entry[mod.type];
        } else {
          entry[mod.type] = mod.vals;
        }

        break;

      case 'add':
        if (!entry[mod.type]) {
          entry[mod.type] = mod.vals;
        } else {
          mod.vals.forEach((v) => {
            if (entry[mod.type].indexOf(v) === -1) entry[mod.type].push(v);
          });
        }

        break;

      case 'delete':
        if (!entry[mod.type]) return next(new ldap.NoSuchAttributeError(mod.type));

        delete entry[mod.type];

        break;

      default:
        break;
    }
  }
  database.setState(db);
  database.write();
  res.end();
  return next();
});

server.search(SUFFIX, authorize, (req, res, next) => {
  const dn = req.dn.toString();
  const db = database.getState();
  if (!db[dn]) return next(new ldap.NoSuchObjectError(dn));

  let scopeCheck;

  switch (req.scope) {
    case 'base':
      if (req.filter.matches(db[dn])) {
        res.send({
          dn,
          attributes: db[dn]
        });
      }

      res.end();
      return next();

    case 'one':
      scopeCheck = (k) => {
        if (req.dn.equals(k)) return true;

        const parent = ldap.parseDN(k).parent();
        return parent ? parent.equals(req.dn) : false;
      };
      break;

    case 'sub':
      scopeCheck = k => req.dn.equals(k) || req.dn.parentOf(k);

      break;
    default:
      break;
  }

  Object.keys(db).forEach((key) => {
    if (!scopeCheck(key)) return;

    if (req.filter.matches(db[key])) {
      res.send({
        dn: key,
        attributes: db[key]
      });
    }
  });

  res.end();
  return next();
});

// /--- Fire it up

server.listen(1389, () => {
  console.log('LDAP server up at: %s', server.url);
});
