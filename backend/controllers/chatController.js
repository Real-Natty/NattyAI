const { generateChatResponse } = require("../services/aiService");

async function chat(req, res, next) {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a conversation message.",
      });
    }

    if (messages.length > 40) {
      return res.status(400).json({
        success: false,
        message: "This conversation has too many messages. Start a new chat.",
      });
    }

    const validMessages = messages.every(
      (message) =>
        message &&
        ["user", "assistant"].includes(message.role) &&
        typeof message.content === "string" &&
        message.content.trim().length > 0 &&
        message.content.length <= 10000,
    );

    if (!validMessages) {
      return res.status(400).json({
        success: false,
        message: "One or more conversation messages are invalid.",
      });
    }

    const response = await generateChatResponse({
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content.trim(),
      })),
    });

    return res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { chat };
