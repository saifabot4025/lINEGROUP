
const express = require("express");
const line = require("@line/bot-sdk");
const { handleEvent } = require("./services/commandManager");
const app = express();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);
app.use("/webhook", line.middleware(config), async (req, res) => {
  try {
    const results = await Promise.all(
      req.body.events.map((event) => handleEvent(event, client))
    );
    res.json(results);
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).end();
  }
});

app.get("/", (req, res) => res.send("LINE Bot All-in-One PRO is running."));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
