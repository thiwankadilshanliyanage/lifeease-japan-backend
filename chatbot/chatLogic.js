// backend/chatLogic.js
const knowledgeBase = require('../chatbot/knowledgeBase');

// helper: find topic object by id
function getTopicById(id) {
  if (!id) return null;
  return knowledgeBase.find(item => item.id === id) || null;
}

// fallback message when no match
function defaultAnswer(lang = 'en') {
  if (lang === 'jp') {
    return `🌸 ナビ先輩です。
次のトピックについてサポートできます：

• 留学生のバイト時間ルール（週28時間など）
• アパート契約（礼金・保証人・ゴミルール）
• 市役所の手続き（住所変更・住民票）
• 店長・先生・市役所で使えるていねい日本語
• 病院・緊急時の連絡のしかた
• 防災バッグと避難（地震・台風など）

どのトピックを知りたいですか？`;
  }

  return `🌸 I'm NaviSenpai.
I can help with:
• Part-time job rules (28h/week)
• Apartment / guarantor / trash rules
• City hall paperwork (address change / 住民票)
• Polite Japanese for manager / teacher / city staff
• Hospital / emergency basics
• Disaster safety + emergency bag

Which topic do you want?`;
}

// detect if user is specifically asking max work hours
function isHoursQuestion(msg) {
  const lower = msg.toLowerCase();
  return (
    lower.includes("how many hours") ||
    lower.includes("hours per week") ||
    lower.includes("max hours") ||
    lower.includes("hour limit") ||
    lower.includes("28h") ||
    lower.includes("28 hours") ||
    // JP style
    lower.includes("何時間") ||
    lower.includes("週何時間") ||
    lower.includes("バイト 何時間") ||
    lower.includes("シフト 何時間")
  );
}

// choose best text from a topic (mini or full)
function renderTopicAnswer(topic, lang, userMessageRaw) {
  const selectedLang = lang === 'jp' ? 'jp' : 'en';

  // Special case: part-time work hours quick answer
  if (topic.id === "part_time_work" && isHoursQuestion(userMessageRaw)) {
    if (topic.mini && topic.mini[selectedLang]) {
      return topic.mini[selectedLang];
    }
    if (topic.mini && topic.mini.en) {
      return topic.mini.en;
    }
  }

  // normal full content
  if (topic.answer && topic.answer[selectedLang]) {
    return topic.answer[selectedLang];
  }
  if (topic.answer && topic.answer.en) {
    return topic.answer.en;
  }

  // fallback safety
  return defaultAnswer(selectedLang);
}

// find topic from fresh message text
function getBestMatchTopic(userMessageRaw) {
  if (!userMessageRaw || typeof userMessageRaw !== 'string') return null;
  const msg = userMessageRaw.toLowerCase();

  // 1. direct keyword hit
  for (const topic of knowledgeBase) {
    for (const kw of topic.keywords) {
      if (msg.includes(kw.toLowerCase())) {
        return topic;
      }
    }
  }

  // 2. heuristics if keyword wasn't explicit

  // hours question -> part_time_work
  if (isHoursQuestion(msg)) {
    const guess = knowledgeBase.find(t => t.id === "part_time_work");
    if (guess) return guess;
  }

  // address / city hall style
  if (
    msg.includes("address change") ||
    msg.includes("change address") ||
    msg.includes("転入届") ||
    msg.includes("転居届") ||
    msg.includes("住民票") ||
    msg.includes("juminhyo") ||
    msg.includes("city hall") ||
    msg.includes("市役所")
  ) {
    const guess = knowledgeBase.find(t => t.id === "city_hall_registration");
    if (guess) return guess;
  }

  // sim / phone
  if (
    msg.includes("sim") ||
    msg.includes("sim card") ||
    msg.includes("phone number") ||
    msg.includes("携帯") ||
    msg.includes("携帯契約") ||
    msg.includes("mobile plan") ||
    msg.includes("データプラン")
  ) {
    const guess = knowledgeBase.find(t => t.id === "sim_card");
    if (guess) return guess;
  }

  // earthquake / bag / evacuation
  if (
    msg.includes("earthquake") ||
    msg.includes("地震") ||
    msg.includes("台風") ||
    msg.includes("避難") ||
    msg.includes("evacuation") ||
    msg.includes("emergency bag") ||
    msg.includes("防災バッグ") ||
    msg.includes("disaster")
  ) {
    const guess = knowledgeBase.find(t => t.id === "disaster_preparedness");
    if (guess) return guess;
  }

  return null;
}

// main function called by chatRoutes
// expects { userMessageRaw, lang, contextTopicId }
function findBestAnswer({ userMessageRaw, lang = 'en', contextTopicId = null }) {
  const selectedLang = lang === 'jp' ? 'jp' : 'en';

  // 1. try match based on this new message
  let topic = getBestMatchTopic(userMessageRaw);

  // 2. if still nothing, reuse last topic from context
  if (!topic && contextTopicId) {
    const prevTopic = getTopicById(contextTopicId);
    if (prevTopic) {
      topic = prevTopic;
    }
  }

  // 3. if still nothing, return default generic help
  if (!topic) {
    return {
      reply: defaultAnswer(selectedLang),
      topicId: null
    };
  }

  // 4. choose which text to reply (mini or full)
  const replyText = renderTopicAnswer(topic, lang, userMessageRaw);

  return {
    reply: replyText,
    topicId: topic.id
  };
}

module.exports = { findBestAnswer };
