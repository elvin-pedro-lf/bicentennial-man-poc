const functions = require("firebase-functions");
const admin = require("firebase-admin");
const thisApp = admin.initializeApp();
const db = admin.firestore();

const settings = {
  timestampsInSnapshots: true,
  ignoreUndefinedProperties: true,
};

db.settings(settings);

module.exports = {
  db,
  admin,
  storage: thisApp.storage(),
};
