const express = require('express');
const shortid = require('shortid');

const router = express.Router();
const database = require('./database');

router.get('/', (req, res, next) => {
  const query = {};

  if (req.query.type) query.type = req.query.type;
  if (req.query.user) query.user = req.query.user;

  const paginate = {};
  const sort = req.query.order || 'createdAt';

  paginate.page = req.query.page || 1;
  paginate.limit = req.query.limit || 5;
  paginate.offset = paginate.limit * (paginate.page - 1);

  const total = database
    .get('reports')
    .filter(query)
    .value().length;

  const reports = database
    .get('reports')
    .filter(query)
    .sortBy(sort)
    .drop(paginate.offset)
    .value()
    .slice(0, paginate.limit);

  res
    .send({
      total,
      reports
    })
    .end();
});

router.post('/', (req, res, next) => {
  database
    .get('reports')
    .push({
      id: shortid.generate(),
      type: req.body.type,
      user: req.body.user,
      createdAt: Date.now(),
      data: req.body.data
    })
    .write();

  res.status(200).end();
});

module.exports = router;
