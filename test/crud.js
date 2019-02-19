const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/server/index');
const stem = require('../src/stem/vdap');

const should = chai.should();

chai.use(chaiHttp);
describe('CDAP Route', () => {
  describe('Bind', () => {
    it('Should Respond Correct With Good Credential', async () => {
      const res = await chai
        .request(server)
        .post('/vdap/bind')
        .set('bindcredentials', 'cn=root:secret')
        .send({});

      res.should.have.status(200);
    });

    it('Should Respond Incorrect With Bad Credential', async () => {
      const res = await chai
        .request(server)
        .post('/vdap/bind')
        .set('bindcredentials', 'cn=root:empty')
        .send({});

      res.should.have.status(500);
    });
  });

  describe('Create', () => {
    it('Should Respond Incorrect With Existing DN', async () => {
      const res = await chai
        .request(server)
        .post('/vdap/create')
        .set('bindcredentials', 'cn=root:secret')
        .send({
          dn: 'o=example',
          entry: {
            foo: 'bar'
          }
        });

      res.should.have.status(500);
    });

    it('Should Respond Correct With Good Credential', async () => {
      const res = await chai
        .request(server)
        .post('/vdap/create')
        .set('bindcredentials', 'cn=root:secret')
        .send({
          dn: 'dc=mocha,o=example',
          entry: {
            foo: 'bar'
          }
        });

      res.should.have.status(200);

      await chai
        .request(server)
        .post('/vdap/delete')
        .set('bindcredentials', 'cn=root:secret')
        .send({
          dn: 'dc=mocha,o=example'
        });
    });
  });
});
