const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
const { Constants } = require("../../common/constants");

module.exports.ChatCompletions = async (payload) => {
  const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(
      process.env.GOOGLE_MAKERSUITE_API_KEY
    ),
  });

  const _history = [
    ...payload.history,
    { role: Constants.OpenAI.ROLE.USER, content: payload.prompt },
  ];

  const response = await client.generateMessage({
    model: Constants.GoogleAI.MODEL.chatCompletions, // Required. The model to use to generate the result.
    temperature: 0, // Optional. Value `0.0` always uses the highest-probability result.
    candidateCount: 1, // Optional. The number of candidate results to generate.
    prompt: {
      // optional, preamble context to prime responses
      // context: "Respond to all questions with a rhyming poem.",
      // Optional. Examples for further fine-tuning of responses.
      //   examples: [
      //     {
      //       input: { content: "What is the capital of California?" },
      //       output: {
      //         content:
      //           `If the capital of California is what you seek, Sacramento is where you ought to peek.`,
      //       },
      //     },
      //   ],
      // Required. Alternating prompt/response messages.
      messages: [{ content: payload.prompt }],
    },
  });

  return {
    source: "googleai",
    history: _history,
    user: payload.prompt,
    assistant: response,
  };
};
