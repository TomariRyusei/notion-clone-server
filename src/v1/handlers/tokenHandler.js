const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

// JWTトークンを検証
const decodeAndVerifyToken = (req) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    //ベアラだけを取得。
    const bearer = bearerHeader.split(" ")[1];
    try {
      const tokenDecoded = jsonwebtoken.verify(
        bearer,
        process.env.TOKEN_SECRET_KEY
      );
      return tokenDecoded;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};

// JWTトークン認証ミドルウェア
exports.verifyToken = async (req, res, next) => {
  const decodedToken = decodeAndVerifyToken(req);
  if (decodedToken) {
    const user = await User.findById(decodedToken.id);
    if (!user) return res.status(401).json("権限がありません");
    req.user = user;
    next();
  } else {
    res.status(401).json("権限がありません");
  }
};
