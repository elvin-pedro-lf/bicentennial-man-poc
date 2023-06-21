const { Configuration, OpenAIApi } = require("openai");
const { Constants } = require("../../common/constants");

module.exports.ChatCompletions = async (payload) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  try {
    const _history = [
      ...payload.history,
      { role: Constants.OpenAI.ROLE.USER, content: payload.prompt },
    ];
    console.log(
      `***** BEFORE - await openai.createChatCompletion: ${new Date()}`
    );
    const max_tokens =
      Constants.OpenAI.CHAT_TOKEN_LIMIT_16K - payload.totalTokens;
    const response = await openai.createChatCompletion({
      model: Constants.OpenAI.MODEL.chatCompletions16k,
      messages: _history,
      temperature: 0,
      user: payload.user,
    });
    console.log(
      `***** AFTER - await openai.createChatCompletion: ${new Date()}`
    );
    if (
      response.data.choices[0].finish_reason !==
      Constants.OpenAI.FINISH_REASON.COMPLETE
    ) {
      let errorMessage = `Request Failed! `;
      if (
        response.data.choices[0].finish_reason ===
        Constants.OpenAI.FINISH_REASON.INCOMPLETE
      ) {
        errorMessage += "\nMaximum number of tokens exceeded.";
      }

      throw new Error(
        `${errorMessage}\nERROR: finish_reason - ${response.data.choices[0].finish_reason}`
      );
    } else {
      return {
        source: "openai",
        history: _history,
        user: payload.prompt,
        assistant: response.data,
        selectedProfileAndPreferences: payload.selectedProfileAndPreferences,
      };
    }
  } catch (error) {
    console.error("functions.lib.OpenAI.ChatCompletions.ERROR: ", error);
    throw error;
  }
};
