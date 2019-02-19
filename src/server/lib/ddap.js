const ldap = require('ldapjs');
// const util = require('util');

function promisify(fn) {
  return () => {
    const { client } = this;
    const args = Array.prototype.slice.call(arguments);

    return new Promise((resolve, reject) => {
      args.push((err, result) => {
        if (err) reject(err);
        else resolve(result);
      });

      client[fn](...args);
    });
  };
}

function Client(option) {
  this.client = ldap.createClient(option);

  // ['bind', 'add', 'compare', 'del', 'exop', 'modify', 'modifyDN', 'unbind'].forEach((fn) => {
  //   // console.log(this);
  //   Client.prototype[fn] = util.promisify(this.client[fn]);
  // });

  // this.bind = promisify(this.client.bind);
  // this.add = promisify(this.client.add);
}

['bind', 'add', 'compare', 'del', 'exop', 'modify', 'modifyDN', 'unbind'].forEach((fn) => {
  Client.prototype[fn] = promisify(fn);
});

const vdap = {
  Client,
  Change: ldap.Change
};

module.exports = vdap;
