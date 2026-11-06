const { generateImage } = require("../services/imageService");

async function createImage(req, res, next) {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter an image description.",
      });
    }

    if (prompt.length > 2048) {
      return res.status(400).json({
        success: false,
        message: "Your prompt cannot exceed 2048 characters.",
      });
    }

    const image = await generateImage(prompt.trim());

    return res.status(200).json({
      success: true,
      image,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createImage };
