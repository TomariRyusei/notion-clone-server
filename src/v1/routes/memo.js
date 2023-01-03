const router = require("express").Router();
const tokenHandler = require("../handlers/tokenHandler");
const memoConttoller = require("../controllers/memo");

router.post("/", tokenHandler.verifyToken, memoConttoller.create);

module.exports = router;
