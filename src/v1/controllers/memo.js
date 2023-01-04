const Memo = require("../models/memo");

exports.create = async (req, res) => {
  try {
    const memoCount = await Memo.find().count();
    const memo = await Memo.create({
      user: req.user._id,
      position: memoCount > 0 ? memoCount : 0,
    });
    res.status(201).json(memo);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getAll = async (req, res) => {
  try {
    const memos = await Memo.find({ user: req.user._id }).sort("-position");
    res.status(200).json(memos);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getOne = async (req, res) => {
  try {
    const { memoId } = req.params;
    const memo = await Memo.findOne({ user: req.user._id, _id: memoId });
    if (!memo) return res.status(400).json("メモが存在しません");
    res.status(200).json(memo);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.update = async (req, res) => {
  try {
    const { memoId } = req.params;
    const { title, description } = req.body;
    if (title === "") req.body.title = "無題";
    if (description === "")
      req.body.description = "ここに自由に記入してください";
    const currentMemo = await Memo.findById(memoId);
    if (!currentMemo) return res.status(404).json("メモが存在しません");

    const updatedMemo = await Memo.findByIdAndUpdate(memoId, {
      $set: req.body,
    });

    res.status(200).json(updatedMemo);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.delete = async (req, res) => {
  try {
    const { memoId } = req.params;
    const memo = await Memo.findOne({ user: req.user._id, _id: memoId });
    if (!memo) return res.status(400).json("メモが存在しません");
    await Memo.deleteOne({ _id: memoId });
    res.status(200).json("メモを削除しました");
  } catch (error) {
    res.status(500).json(error);
  }
};
