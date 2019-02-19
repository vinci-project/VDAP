const express = require('express');
const cors = require('cors');

const app = express();
const nodeRouter = require('./node');
const reportRouter = require('./report');

app.use(cors());
app.use(express.json());
app.use('/nodes', nodeRouter);
app.use('/reports', reportRouter);

app.listen(8545, () => console.log('Listening on port 8545!'));

module.exports = app; // Export for testing
