// backend/routes/chatRoutes.js
const express = require('express');
const router = express.Router();

const { findBestAnswer } = require('../chatbot/chatLogic');

// POST /api/chat
// body example:
// {
//   "message": "how to get sim card",
//   "language": "en",
//   "contextTopicId": "part_time_work"
// }
router.post('/', (req, res) => {
  const userMessage = req.body.message || '';
  const language = req.body.language || 'en'; // 'en' or 'jp'
  const contextTopicId = req.body.contextTopicId || null;

  const { reply, topicId } = findBestAnswer({
    userMessageRaw: userMessage,
    lang: language,
    contextTopicId
  });

  return res.json({
    reply,
    language,
    topicId // <-- frontend will keep this for next turn
  });
});

module.exports = router;
