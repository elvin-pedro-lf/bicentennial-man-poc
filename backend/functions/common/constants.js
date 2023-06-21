module.exports.Constants = {
  OpenAI: {
    ROLE: {
      USER: "user",
      ASSISTANT: "assistant",
    },
    MODEL: {
      chatCompletions: "gpt-3.5-turbo",
      chatCompletions16k: "gpt-3.5-turbo-16k",
      completions: "text-davinci-003",
    },
    FINISH_REASON: {
      COMPLETE: "stop",
      INCOMPLETE: "length",
      OMITTED: "content_filter",
    },
    CHAT_TOKEN_LIMIT: 4096,
    CHAT_TOKEN_LIMIT_16K: 16384,
  },
  GoogleAI: {
    MODEL: {
      chatCompletions: "models/chat-bison-001",
      completions: "models/text-bison-001",
      embedding: "models/embedding-gecko-001",
    },
  },
  firestore: {
    collections: {
      Exerciser: "Exerciser",
      OpenAIChatHistory: "openai_chat_history",
      OpenAIChatWorkout: "openai_chat_workout",
    },
  },
};
