const { Constants } = require("../../common/constants");
const { db, admin } = require("../../modules/admin");

module.exports.GetExerciser = async (exerciserId) => {
  return db
    .collection(Constants.firestore.collections.Exerciser)
    .doc(exerciserId)
    .get();
};

module.exports.DeleteAllAIWorkouts = async (exerciserId) => {
  const collectionRef = db.collection(
    `${Constants.firestore.collections.Exerciser}/${exerciserId}/${Constants.firestore.collections.OpenAIChatWorkout}`
  );
  return DeleteAllDocuments(
    collectionRef.orderBy("createdAt").orderBy("sortIndex").limit(50)
  );
};

module.exports.DeleteAllAIHistory = async (exerciserId) => {
  const collectionRef = db.collection(
    `${Constants.firestore.collections.Exerciser}/${exerciserId}/${Constants.firestore.collections.OpenAIChatHistory}`
  );
  return DeleteAllDocuments(
    collectionRef.orderBy("createdAt").orderBy("sortIndex").limit(50)
  );
};

const DeleteAllDocuments = async (query) => {
  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject);
  });
};

module.exports.GetExerciserHistory = async (docId) => {
  return db
    .collection(
      `${Constants.firestore.collections.Exerciser}/${docId}/${Constants.firestore.collections.OpenAIChatHistory}`
    )
    .where("active", "==", true)
    .orderBy("createdAt")
    .orderBy("sortIndex")
    .get()
    .then((snapshot) => {
      let chatGPTHistory = [];
      if (!snapshot.empty) {
        snapshot.forEach((doc) =>
          chatGPTHistory.push({ ...doc.data(), id: doc.id })
        );
      }
      return chatGPTHistory;
    })
    .catch((error) => {
      throw error;
    });
};

module.exports.GetExerciserWorkout = async (docId) => {
  return db
    .collection(
      `${Constants.firestore.collections.Exerciser}/${docId}/${Constants.firestore.collections.OpenAIChatWorkout}`
    )
    .orderBy("createdAt")
    .orderBy("sortIndex")
    .get()
    .then((snapshot) => {
      let workoutJSON = {};
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          const __docData__ = doc.data();
          Object.keys(__docData__).forEach((key) => {
            if (key !== "createdAt" && key !== "sortIndex") {
              workoutJSON[key] = {};
              sortBySortIndex(
                __docData__[key],
                workoutJSON[key],
                Object.keys(__docData__[key]),
                0
              );
            }
          });
        });
      }

      return workoutJSON;
    })
    .catch((error) => {
      console.error("***** GetExerciserWorkout ERROR: ", error);
      throw error;
    });
};

const sortBySortIndex = (inputJSON, outputJSON, _keys_, _i_) => {
  const i = _keys_.findIndex((o) => inputJSON[o].sortIndex === _i_);
  outputJSON[_keys_[i]] = inputJSON[_keys_[i]];

  if (++_i_ < _keys_.length)
    sortBySortIndex(inputJSON, outputJSON, _keys_, _i_);
};

const deleteQueryBatch = async (query, resolve) => {
  const snapshot = await query.get();
  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
};
