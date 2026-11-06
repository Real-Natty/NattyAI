const express = require("express");

const { createContent } = require("../controllers/aiController");
const { createImage } = require("../controllers/imageController");
const { chat } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate", protect, createContent);
router.post("/chat", protect, chat);
router.post("/image", protect, createImage);

module.exports = router;
