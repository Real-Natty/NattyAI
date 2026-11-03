const { generateContent } = require("../services/aiService");

async function createContent(req, res, next) {
  try {
    const { tool, prompt } = req.body;

    if (!tool || !prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please select a tool and enter a prompt.",
      });
    }

    if (prompt.length > 10000) {
      return res.status(400).json({
        success: false,
        message: "Your prompt cannot exceed 10,000 characters.",
      });
    }

    const content = await generateContent({
      tool,
      prompt: prompt.trim(),
    });

    return res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createContent };
