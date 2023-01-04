const router = require("express").Router();
const tokenHandler = require("../handlers/tokenHandler");
const memoConttoller = require("../controllers/memo");

router.post("/", tokenHandler.verifyToken, memoConttoller.create);
router.get("/", tokenHandler.verifyToken, memoConttoller.getAll);
router.get("/:memoId", tokenHandler.verifyToken, memoConttoller.getOne);
router.put("/:memoId", tokenHandler.verifyToken, memoConttoller.update);
router.delete("/:memoId", tokenHandler.verifyToken, memoConttoller.delete);

module.exports = router;
