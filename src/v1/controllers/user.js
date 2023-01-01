const JWT = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const User = require("../models/user");

const AUTH_ERROR_MSG = "ユーザー名もしくはパスワードが不正です";

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
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({
        errors: {
          param: "username",
          message: AUTH_ERROR_MSG,
        },
      });

    // パスワード照合
    const decrypttedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (decrypttedPassword !== password)
      return res.status(401).json({
        errors: {
          param: "password",
          message: AUTH_ERROR_MSG,
        },
      });

    // JWT発行
    const token = JWT.sign({ id: user.id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h", //24時間で失効
    });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json(error);
  }
};
