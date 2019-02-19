const { port, id } = require('minimist')(process.argv.slice(2));
const axios = require('axios');
const express = require('express');
const apiRouter = require('./api');

const newStorageBe = (__port, __id) => {
  const app = express();
  app.use(express.json());
  app.use('/api', apiRouter(__port, __id));
  app.listen(__port, () => console.log(`Running Storage BE Node ${__id} at port:${__port}`));
  axios.post('http://localhost:8545/nodes', {
    id: __id,
    endpoint: `http://localhost:${__port}`
  });
  return app;
};

const ports = typeof port === 'number' ? [port] : port.split(',');
const ids = id.split(',');

ports.forEach((_port, index) => {
  console.log(ids[index]);
  newStorageBe(_port, ids[index]);
});
