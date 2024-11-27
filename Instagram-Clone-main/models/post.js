const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: false },
  photo: { type: String, required: true },
  postedBy: { type: ObjectId, ref: "User" },
  likes: [{ type: ObjectId, ref: "User" }],
  comments: [
    {
      text: String,
      postedBy: { type: ObjectId, ref: "User" },
    },
  ],

  postDate: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("Post", postSchema);
