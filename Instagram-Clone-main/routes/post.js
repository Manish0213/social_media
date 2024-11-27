const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

router.get("/allposts", requireLogin, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ postDate: -1 })
      .populate("postedBy", "_id name profilePic")
      .populate("comments.postedBy", "_id name profilePic");

    res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      posts: posts,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Error retrieving posts",
      error: err.message,
    });
  }
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !pic) {
    return res.status(400).json({ error: "please provide all the fields" });
  }
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
      // console.log(result)
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/myposts", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name profilePic")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});
//Update Post
router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name profilePic")
    .populate("comments.postedBy", "_id name profilePic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name profilePic")
    .populate("comments.postedBy", "_id name profilePic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name profilePic")
    .populate("postedBy", "_id name profilePic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id name profilePic")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

router.put("/deletecomment/:postId/:commentId", requireLogin, (req, res) => {
  // const comment = {
  //     text:req.body.text,
  //     postedBy:req.user._id
  // }
  Post.findByIdAndUpdate(
    req.params.postId,
    {
      $pull: { comments: { _id: req.params.commentId } },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id ")
    .populate("postedBy", "_id name profilePic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

module.exports = router;
