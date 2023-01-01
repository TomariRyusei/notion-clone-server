const JWT = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const User = require("../models/user");

// ユーザー新規登録
exports.register = async (req, res) => {
  const password = req.body.password;
  try {
    req.body.password = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY);
    const user = await User.create(req.body);
    // JWT発行
    const token = JWT.sign({ id: user.id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h", //24時間で失効
    });
    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json(error);
  }
};
