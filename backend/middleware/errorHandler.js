function errorHandler(err, req, res, next) {
  console.error("NattyAI error:", err.message);

  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message:
        "The AI service is busy or its usage limit has been reached. Please try again later.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "NattyAI could not generate your content. Please try again.",
  });
}

module.exports = errorHandler;
