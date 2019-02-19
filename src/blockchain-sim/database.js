const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db/blockchain.json');
const database = low(adapter);
database.defaults({ reports: [], nodes: [] }).write();
module.exports = database;
