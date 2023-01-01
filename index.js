const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5001;
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());
app.use("/api/v1", require("./src/v1/routes/auth"));

// DB接続
try {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("DB接続成功");
  });
} catch (error) {
  console.log("DB接続失敗" + error);
}

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.listen(PORT, () => {
  console.log("ローカルサーバー起動中...");
});
