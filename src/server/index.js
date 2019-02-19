const express = require('express');
const os = require('os');
const cors = require('cors');

const app = express();
const vdapRouter = require('./routes/vdap');
const reportRouter = require('./routes/report');

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use('/vdap', vdapRouter);
app.use('/reports', reportRouter);

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.listen(8080, () => console.log('Listening on port 8080!'));

module.exports = app; // Export for testing
