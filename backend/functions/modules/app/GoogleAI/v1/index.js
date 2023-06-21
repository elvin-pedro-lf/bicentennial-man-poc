/* eslint-disable linebreak-style */
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const functions = require("firebase-functions");
const secureCompare = require("secure-compare");
//const { db, admin } = require("../../../admin");
const libGoogleAI = require("../../../../lib/GoogleAI");
//const { Constants } = require("../../../../common/constants");

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

/***********************************************************************
 * VALIDATE Key
 ***********************************************************************/
app.use((req, res, next) => {
  if (req.query && secureCompare(req.query.key, functions.config().cron.key)) {
    return next();
  } else {
    return res.status(403).send({
      status: "error",
      message: "Missing/Invalid Key",
    });
  }
});

/***********************************************************************
 * CALL OpenAI Chat Completions API to generate workouts
 * for input exerciser
 ***********************************************************************/
app.post("/v1/workouts/:id", async (req, res) => {
  const exerciserId = req.params.id;
  return libGoogleAI
    .ChatCompletions({ ...req.body.payload, user: exerciserId })
    .then((__data__) => {
      return res.status(200).send(__data__);
    })
    .catch((error) => {
      return res.status(400).send({ status: "error", message: error.message });
    });
});

app.use((req, res) => {
  return res.status(405).send({
    status: "error",
    message: "The HTTP method used is not supported for this resource.",
  });
});

module.exports = app;
