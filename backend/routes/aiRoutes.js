const express = require("express");

const { createContent } = require("../controllers/aiController");
const { chat } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate", protect, createContent);
router.post("/chat", protect, chat);

module.exports = router;
