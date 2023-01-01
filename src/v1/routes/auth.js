const router = require("express").Router();
const dotenv = require("dotenv");
const { body } = require("express-validator");

const User = require("../models/user");
const validate = require("../handlers/validation");
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
    .withMessage("パズワードは8文字以上である必要があります"),
  body("comfirmPassword")
    .isLength({ min: 8 })
    .withMessage("確認用パズワードは8文字以上である必要があります"),
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

module.exports = router;
