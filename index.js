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
// ① 必要なモジュールと初期設定
const express = require('express');
const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: '＜あなたのアクセストークン＞',
  channelSecret: '＜あなたのチャネルシークレット＞'
};
const app = express();
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) => res.json(result));
});

const client = new line.Client(config);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

// ② 質問リストとユーザーの状態保持
const stressQuestions = [
  "最近、気分が晴れないことが多いですか？",
  "職場でイライラすることが多いですか？",
  "体のだるさを感じることが多いですか？",
  "寝つきが悪い、または途中で目が覚めますか？",
  "周囲からのサポート（上司・同僚）を感じられますか？",
  "自分の仕事がうまくいっていると感じますか？",
  "不安感が強いと感じることはありますか？",
  "疲労が蓄積していると感じますか？",
  "今の仕事に満足していますか？",
  "相談できる相手がいますか？"
];
const userStates = {}; // ユーザーIDごとの状態保持

// ③ イベント処理関数（メインロジック）
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userId = event.source.userId;
  const userMessage = event.message.text;

  if (!userStates[userId]) {
    // 初期化
    userStates[userId] = { step: 0, score: 0, inProgress: false };
  }

  // ストレスチェック開始
  if (userMessage.includes("ストレスチェック")) {
    userStates[userId] = { step: 0, score: 0, inProgress: true };
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: `Q1: ${stressQuestions[0]}（はい／いいえ）`
    });
  }

  // ストレスチェック中
  if (userStates[userId].inProgress) {
    const step = userStates[userId].step;
    const answer = userMessage;

    // 「はい」なら1点加算
    if (answer.includes("はい")) {
      userStates[userId].score += 1;
    }

    userStates[userId].step += 1;

    if (userStates[userId].step < stressQuestions.length) {
      const nextQuestion = stressQuestions[userStates[userId].step];
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `Q${userStates[userId].step + 1}: ${nextQuestion}（はい／いいえ）`
      });
    } else {
      // チェック完了
      const score = userStates[userId].score;
      let result = "";

      if (score <= 2) result = "ストレス度：低（良好な状態です！）";
      else if (score <= 5) result = "ストレス度：中（少し疲れが見られます）";
      else result = "ストレス度：高（高ストレス状態。ケアが必要です）";

      userStates[userId] = { step: 0, score: 0, inProgress: false };

      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `ストレスチェックが完了しました！\nあなたのスコア：${score}点\n${result}`
      });
    }
  }

  // その他のメッセージには通常応答
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: 'こんにちは、Mimiです。あなたの健康を一緒に考えます😊',
  });
}
