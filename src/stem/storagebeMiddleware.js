const ldap = require('ldapjs');
const axios = require('axios');

const add = async (req, res, next) => {
  const dn = req.dn.toString();
  const body = req.toObject().attributes;

  req.originalData = {
    dn,
    body
  };

  const { data } = await axios.get('http://localhost:8545/nodes');
  const NodeList = data.map(node => node.endpoint);
  const promises = NodeList.map(node => axios.post(`${node}/api/add`, req.originalData));

  Promise.all(promises)
    .then(() => {
      res.end();
      next();
    })
    .catch(() => {
      next(new ldap.EntryAlreadyExistsError(dn));
    });
};

const del = async (req, res, next) => {
  const dn = req.dn.toString();

  req.originalData = {
    dn
  };

  const { data } = await axios.get('http://localhost:8545/nodes');
  const NodeList = data.map(node => node.endpoint);
  const promises = NodeList.map(node => axios.post(`${node}/api/del`, req.originalData));

  Promise.all(promises)
    .then(() => {
      res.end();
      next();
    })
    .catch(() => {
      next(new ldap.NoSuchObjectError(dn));
    });
};

const modify = async (req, res, next) => {
  // console.log('Modify Captured at stem');

  const dn = req.dn.toString();
  const { changes } = req;

  if (!changes.length) return next(new ldap.ProtocolError('changes required'));

  // console.log(changes[0].modification.vals, changes[0].modification.type, changes[0].operation);

  const ldapChanges = changes.map((change) => {
    const { operation, modification } = change;
    const { vals, type } = modification;
    return {
      modification: {
        vals,
        type
      },
      operation
    };
  });

  req.originalData = {
    dn,
    changes: ldapChanges
  };

  const { data } = await axios.get('http://localhost:8545/nodes');
  const NodeList = data.map(node => node.endpoint);
  const promises = NodeList.map(node => axios.post(`${node}/api/modify`, req.originalData));

  Promise.all(promises)
    .then(() => {
      // console.log('Modify Done');
      res.end();
      next();
    })
    .catch(() => {
      next(new ldap.NoSuchObjectError(dn));
    });
};

const search = async (req, res, next) => {
  const dn = req.dn.toString();
  const { filter, scope } = req;

  const { data } = await axios.get('http://localhost:8545/nodes');
  const NodeList = data.map(node => node.endpoint);
  const node = NodeList[Math.floor(Math.random() * NodeList.length)];

  axios
    .post(`${node}/api/search`, {
      dn,
      scope,
      filter: filter.toString()
    })
    .then((response) => {
      const { data } = response;
      data.forEach((item) => {
        res.send({
          dn: item.dn,
          attributes: item.attributes
        });
      });
      res.end();
      next();
    })
    .catch(() => {
      next(new ldap.NoSuchObjectError(dn));
    });
};

const storagebe = {
  add,
  del,
  modify,
  search
};

module.exports = storagebe;
