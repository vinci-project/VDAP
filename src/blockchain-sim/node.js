const express = require('express');
const axios = require('axios');

const router = express.Router();
const database = require('./database');

const checkNodeExists = () => {
  const nodes = database.get('nodes').value();

  nodes.forEach((node) => {
    axios
      .get(`${node.endpoint}/api/health`, {
        timeout: 2000
      })
      .then(() => {
        database
          .get('nodes')
          .find({ id: node.id })
          .assign({ lastShakeAt: Date.now() })
          .write();
      })
      .catch((err) => {
        database
          .get('nodes')
          .remove({
            id: node.id
          })
          .write();
      });
  });
};

router.get('/', (req, res, next) => {
  res.send(database.get('nodes').value()).end();
});

router.post('/', (req, res, next) => {
  const node = database
    .get('nodes')
    .find({
      id: req.body.id
    })
    .value();

  if (!node) {
    database
      .get('nodes')
      .push({
        id: req.body.id,
        endpoint: req.body.endpoint
      })
      .write();
  }

  res.status(200).end();
});

setInterval(checkNodeExists, 5000);

module.exports = router;
