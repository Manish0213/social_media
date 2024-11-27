const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/profile/:userid", requireLogin, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userid }).select(
      "-password"
    );
    if (!user) {
      return res.send("user not found");
    }
    const posts = await Post.find({ postedBy: req.params.userid });
    res.json({ user, posts });
  } catch (err) {
    // return res.status(422).json({error:err})
    res.send("plese enter a valid id");
  }
});

router.put("/follow/:userid", requireLogin, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.userid,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    }
  );
  const currUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: { following: req.params._id },
    },
    {
      new: true,
    }
  );

  res.status(200).json(user);
});

router.put("/unfollow/:userid", requireLogin, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.userid,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    }
  );
  const currUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { following: req.params._id },
    },
    {
      new: true,
    }
  );

  res.status(200).json(user);
});

router.get("/myprofile", requireLogin, (req, res) => {
  User.findOne({ _id: req.user._id })
    .populate("followers")
    .populate("following")
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/updateprofile", requireLogin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          profilePic: req.body.profilePic,
          about: req.body.about,
          name: req.body.name,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json(user);
  } catch {
    res.json({ msg: "Error" });
  }
});

router.get("/search-users", async (req, res) => {
  const searchQuery = req.body.name;
  console.log(searchQuery);
  if (!searchQuery) {
    return res.status(400).json({ 
        response_status:400,
        reponse_message: "Search query is empty" });
  }
  try {
    const users = await User.find({
      name: { $regex: searchQuery, $options: "i" },
    });

    res.status(200).json({
      response_status: true,
      response_message: "Users found successfully",
      users: users,
      user_count: users.length,
    });
  } catch (error) {
    res.status(404).json({
      response_code: 404,
      response_message: "No Users found with this username",
      error: error,
    });
    res.status(500).json({ message: "Error searching users", error });
  }
});

module.exports = router;
