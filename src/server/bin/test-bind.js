const ldap = require('ldapjs');

const client = ldap.createClient({
  url: 'ldap://127.0.0.1:1389'
});

client.bind('cn=root', 'secret', (err) => {
  console.log(err);
});

const entry = {
  cn: 'foo',
  sn: 'bar',
  email: ['foo@bar.com', 'foo1@bar.com'],
  objectclass: 'fooPerson'
};

client.add('dc=com,o=example', entry, (err) => {
  console.log(err);
});
