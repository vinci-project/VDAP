const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/server/index');
const stem = require('../src/stem/vdap');

const should = chai.should();

chai.use(chaiHttp);
describe('CDAP Report', () => {
  describe('Endpoint', () => {
    it('Should respond 200', async () => {
      const res = await chai.request(server).get('/reports');

      res.should.have.status(200);
    });
  });

  // describe('Create', () => {
  //   it('Should Have A Create Report', async () => {
  //     await chai
  //       .request(server)
  //       .post('/vdap/create')
  //       .set('bindcredentials', 'cn=root:secret')
  //       .send({
  //         dn: 'cn=testfrommocha, ou=users, dc=com, o=example',
  //         entry: {
  //           foo: 'bar'
  //         }
  //       });

  //     await chai
  //       .request(server)
  //       .post('/vdap/delete')
  //       .set('bindcredentials', 'cn=root:secret')
  //       .send({
  //         dn: 'cn=testfrommocha, ou=users, dc=com, o=example'
  //       });

  //     const res = await chai
  //       .request(server)
  //       .get('/reports?type=create')

  //     res.should.have.status(200);
  //   });

  // });
});
