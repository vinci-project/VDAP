const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

module.exports = (port, id) => {
  const adapter = new FileSync(`db/${id}@${port}.json`);
  const database = low(adapter);
  database.defaults({}).write();

  return {
    readDb: (req, res, next) => {
      req.db = database.getState();
      return next();
    },
    saveDb: (req, res, next) => {
      database.setState(req.db);
      database.write();
      return next();
    }
  };
};
