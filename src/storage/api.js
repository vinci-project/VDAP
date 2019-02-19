const express = require('express');
const ldap = require('ldapjs');

module.exports = (port, id) => {
  const router = express.Router();
  const { readDb, saveDb } = require('./db')(port, id);

  router.get('/health', (req, res, next) => {
    res.status(200).end();
  });

  router.post('/search', readDb, (req, res, next) => {
    // console.log(req.body);
    // res.status(200).end();

    const { db } = req;
    const { dn, filter, scope } = req.body;
    const ldapFilter = ldap.parseFilter(filter);
    const ldapDN = ldap.parseDN(dn);
    const results = [];

    let scopeCheck;

    switch (scope) {
      case 'base':
        if (ldapFilter.matches(db[dn])) {
          results.push({
            dn,
            attributes: db[dn]
          });
        }
        res.send(results).end();
        return next();

      case 'one':
        scopeCheck = (k) => {
          if (ldapDN.equals(k)) return true;

          const parent = ldap.parseDN(k).parent();
          return parent ? parent.equals(ldapDN) : false;
        };
        break;

      case 'sub':
        scopeCheck = k => ldapDN.equals(k) || ldapDN.parentOf(k);
        break;
      default:
        break;
    }

    Object.keys(db).forEach((key) => {
      if (!scopeCheck(key)) return;

      if (ldapFilter.matches(db[key])) {
        results.push({
          dn: key,
          attributes: db[key]
        });
      }
    });

    res.send(results).end();
    return next();
  });

  router.post(
    '/add',
    readDb,
    (req, res, next) => {
      const { db } = req;
      const { dn, body } = req.body;
      if (db[dn]) {
        return res.status(404).end();
      }
      db[dn] = body;
      res.status(200).end();
      return next();
    },
    saveDb
  );

  router.post(
    '/del',
    readDb,
    (req, res, next) => {
      const { db } = req;
      const { dn } = req.body;
      if (!db[dn]) {
        return res.status(404).end();
      }
      delete db[dn];
      res.status(200).end();
      return next();
    },
    saveDb
  );

  router.post(
    '/modify',
    readDb,
    (req, res, next) => {
      const { db } = req;
      const { dn, changes } = req.body;

      console.log(`Modifying Coming At Port ${port}`, dn, changes);

      if (!db[dn]) {
        return res.status(404).end();
      }
      const entry = db[dn];

      for (let i = 0; i < changes.length; i++) {
        const mod = changes[i].modification;
        switch (changes[i].operation) {
          case 'replace':
            if (!entry[mod.type]) {
              return res
                .send(mod.type)
                .status(403)
                .end();
            }

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
            if (!entry[mod.type]) {
              return res
                .send(mod.type)
                .status(403)
                .end();
            }

            delete entry[mod.type];

            break;

          default:
            break;
        }
      }
      res.status(200).end();
      return next();
    },
    saveDb
  );

  return router;
};
