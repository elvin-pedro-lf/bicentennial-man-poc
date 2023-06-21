/* eslint-disable linebreak-style */
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const functions = require("firebase-functions");
const secureCompare = require("secure-compare");
const { db, admin } = require("../../../admin");
const libOpenAI = require("../../../../lib/OpenAI");
const { Constants } = require("../../../../common/constants");
const {
  GetExerciserWorkout,
  GetExerciserHistory,
  DeleteAllAIWorkouts,
  DeleteAllAIHistory,
  GetExerciser,
} = require("../../../../lib/firestore");

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
 * GET Exerciser OpenAI Chat history from Firestore DB
 * Collection: Exerciser.openai_chat_history
 ***********************************************************************/
app.get("/v1/chat/:id", async (req, res) => {
  const exerciserId = req.params.id;
  return GetExerciserHistory(exerciserId)
    .then((chat) => {
      return res.status(200).send({ chat });
    })
    .catch((error) => {
      return res.status(400).send({ status: "error", message: error.message });
    });
});

/***********************************************************************
 * GET Exerciser OpenAI Chat Workouts from Firestore DB
 * Collection: Exerciser.openai_chat_workout
 ***********************************************************************/
app.get("/v1/workouts/:id", async (req, res) => {
  const exerciserId = req.params.id;
  return GetExerciserWorkout(exerciserId)
    .then((data) => {
      return res.status(200).send({ ...data });
    })
    .catch((error) => {
      return res.status(400).send({ status: "error", message: error.message });
    });
});

/***********************************************************************
 * CALL OpenAI Chat Completions API to generate workouts
 * for input exerciser
 ***********************************************************************/
app.post("/v1/workouts/:id", async (req, res) => {
  console.log(`***** START - POST /v1/workouts:id: ${new Date()}`);
  const exerciserId = req.params.id;
  if (req.body.payload.source === "firestore") {
    let returnData = {
      source: "firestore",
      history: [],
      user: null,
      assistant: {
        model: Constants.OpenAI.MODEL.chatCompletions16k,
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
        },
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: null,
            },
          },
        ],
      },
      selectedProfileAndPreferences: {
        clientAge: 0,
        clientSexAtBirth: null,
        programLengthInWeeks: 0,
      },
    };
    const exerciserDocRef = db
      .collection(Constants.firestore.collections.Exerciser)
      .doc(exerciserId);
    return exerciserDocRef
      .get()
      .then((exerciserDoc) => {
        if (
          exerciserDoc.exists &&
          exerciserDoc.data().selectedProfileAndPreferences
        ) {
          returnData.selectedProfileAndPreferences =
            exerciserDoc.data().selectedProfileAndPreferences;
        }

        return GetExerciserHistory(exerciserId);
      })
      .then((_history) => {
        returnData.history = _history;
        return GetExerciserWorkout(exerciserId);
      })
      .then((_workout) => {
        returnData.assistant.choices[0].message.content =
          JSON.stringify(_workout);
        return res.status(200).send(returnData);
      })
      .catch((error) => {
        return res
          .status(400)
          .send({ status: "error", message: error.message });
      });
  } else {
    // source === "openai"
    return libOpenAI
      .ChatCompletions({ ...req.body.payload, user: exerciserId })
      .then((__data__) => {
        console.log(`***** END - POST /v1/workouts:id: ${new Date()}`);
        return res.status(200).send(__data__);
      })
      .catch((error) => {
        return res
          .status(400)
          .send({ status: "error", message: error.message });
      });
  }
});

/***********************************************************************
 * Save block of training from ChatGPT
 * in the Exerciser.openai_chat_workout subcollection
 * Each week is a record for tracking progress
 ***********************************************************************/
app.put("/v1/workouts/:id", async (req, res) => {
  const exerciserId = req.params.id;
  const docRef = db
    .collection(Constants.firestore.collections.Exerciser)
    .doc(exerciserId);
  return docRef
    .get()
    .then((exerciserDoc) => {
      docRef.update({
        selectedProfileAndPreferences: {
          ...req.body.selectedProfileAndPreferences,
        },
      });
      if (exerciserDoc.exists) {
        return DeleteAllAIWorkouts(exerciserId);
      } else {
        throw new Error(`${exerciserId} is not a valid Exerciser ID.`);
      }
    })
    .then(() => {
      const workoutJSON = req.body.workout;
      return Promise.all(
        Object.keys(workoutJSON).map((week, i) => {
          Object.keys(workoutJSON[week]).forEach((_day_, j) => {
            workoutJSON[week][_day_].Completed =
              workoutJSON[week][_day_].Completed || false;
            workoutJSON[week][_day_].sortIndex = j;
          });

          return docRef
            .collection(Constants.firestore.collections.OpenAIChatWorkout)
            .add({
              [week]: workoutJSON[week],
              sortIndex: i,
              createdAt: admin.firestore.Timestamp.now(),
            });
        })
      );
    })
    .then(() => {
      return res.status(204).send();
    })
    .catch((error) => {
      return res.status(400).send({ status: "error", message: error.message });
    });
});

/***********************************************************************
 * SAVE Exerciser new OpenAI Chat messages into Firestore DB
 * Collection: Exerciser.openai_chat_workouts
 * Chat messages with id will be skipped
 ***********************************************************************/
app.put("/v1/chat/:id", async (req, res) => {
  const exerciserId = req.params.id;
  const chat = req.body.chat;
  const docRef = db
    .collection(Constants.firestore.collections.Exerciser)
    .doc(exerciserId);
  return docRef
    .get()
    .then((exerciserDoc) => {
      if (exerciserDoc.exists) {
        return DeleteAllAIHistory(exerciserId);
      } else {
        throw new Error(`${exerciserId} is not a valid Exerciser ID.`);
      }
    })
    .then(() => {
      return Promise.all(
        chat
          .filter((msg) => !msg.id)
          .map((msg, i) => {
            return docRef
              .collection(Constants.firestore.collections.OpenAIChatHistory)
              .add({
                ...msg,
                sortIndex: i,
                createdAt: admin.firestore.Timestamp.now(),
                active: true,
              });
          })
      );
    })
    .then(() => {
      return res.status(204).send();
    })
    .catch((error) => {
      console.error("POST openai/v1/chat/:id ERROR: ", error);
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
