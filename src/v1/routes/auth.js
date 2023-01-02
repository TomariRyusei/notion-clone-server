const router = require("express").Router();
const dotenv = require("dotenv");
const { body } = require("express-validator");

const User = require("../models/user");
const validate = require("../handlers/validation");
const tokenHandler = require("../handlers/tokenHandler");
const userConttoller = require("../controllers/user");
dotenv.config();

// ユーザー新規登録API
router.post(
  "/register",
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は8文字以上である必要があります"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上である必要があります"),
  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("確認用パスワードは8文字以上である必要があります"),
  body("username").custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject("このユーザー名は既に使われています");
      }
    });
  }),
  validate.validate,
  userConttoller.register
);

// ログインAPI
router.post(
  "/login",
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は8文字以上である必要があります"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パズワードは8文字以上である必要があります"),
  validate.validate,
  userConttoller.login
);

// JWT認証API
router.post("/verify-token", tokenHandler.verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
