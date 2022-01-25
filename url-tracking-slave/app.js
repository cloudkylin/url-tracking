const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const urlTracking = require("./handless");
const path = require("path");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors());

app.get(`/`, (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post(`/v2/slave/trackingUrl`, async (req, res) => {
  const { url } = req.body;
  // 判断URL是否有效
  try {
    new URL(url);
  } catch (e) {
    console.error(e);
    res.send({
      status: false,
      message: "URL错误",
      data: [],
    });
    return;
  }
  try {
    // 获取url请求跳转路径
    const trackData = await urlTracking(url);
    res.send({
      status: true,
      message: "success",
      data: trackData,
    });
  } catch (e) {
    console.error(e);
    res.send({
      status: false,
      message: "追踪失败",
      data: [],
    });
  }
});

app.get("/404", (req, res) => {
  res.status(404).send("Not found");
});

app.get("/500", (req, res) => {
  res.status(500).send("Server Error");
});

// Error handler
app.use(function (err, req, res) {
  console.error(err);
  res.status(500).send("Internal Serverless Error");
});

// Web 类型云函数，只能监听 9000 端口
app.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
});
