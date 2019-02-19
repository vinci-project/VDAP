const axios = require('axios');

module.exports = {
  createTransaction: (req, res, next) => next(),
  appendTransaction: (req, res, next) => next(),
  finalizeTransaction: (req, res, next) => next(),
  record: type => (req, res, next) => {
    axios.post('http://localhost:8545/reports', {
      user: req.user,
      type,
      data: req.originalData
    });
    next();
  }
};
