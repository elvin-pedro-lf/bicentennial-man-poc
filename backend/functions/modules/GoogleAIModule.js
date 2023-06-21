const functions = require("firebase-functions");

const GoogleAIApp = require("./app/GoogleAI/v1");

exports.googleai = functions
  .runWith({ timeoutSeconds: 540 })
  .https.onRequest(GoogleAIApp);
