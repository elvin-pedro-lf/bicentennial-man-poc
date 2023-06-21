const functions = require("firebase-functions");

const OpenAIApp = require("./app/OpenAI/v1");

exports.openai = functions
  .runWith({ timeoutSeconds: 540 })
  .https.onRequest(OpenAIApp);
