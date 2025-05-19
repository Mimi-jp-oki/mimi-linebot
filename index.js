const express = require("express");
const line = require("@line/bot-sdk");

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  const replyText = "こんにちは、Mimiです。あなたの健康を一緒に考えます😊";
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: replyText,
  });
}
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMessage = event.message.text;

  if (userMessage.includes('ストレスチェック')) {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ストレスチェックを始めます。\nQ1: 「最近気分が落ち込むことが多かったですか？」（はい／いいえ）',
    });
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: 'こんにちは、Mimiです。あなたの健康を一緒に考えます😊',
  });
}

const client = new line.Client(config);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
