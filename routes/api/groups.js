const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Group = require("../../models/Groups");

/* GROUPS--- CREATE GROUPS - GET GROUPS - DELETE GROUPS - ADD/REMOVE MEMBERS */
/***************************************************************************************************/

// @route   POST api/groups
// @desc    Create a group
// @access  Private
router.post(
  "/",
  [auth, [check("name", "Name is required.").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    try {
      const currentUser = await User.findById(req.user.id).select("-password");

      const newGroup = new Group({
        name: req.body.name,
        creator: req.user.id,
        posts: [],
        members: [currentUser],
        createdAt: Date.now(),
        isPublic: req.body.isPublic,
      });
      const group = await newGroup.save();
      res.json(group);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/groups
// @desc    Get all groups
// @access  Public
router.get("/", auth, async (req, res) => {
  try {
    const groups = await Group.find().sort({ date: -1 });
    res.json(groups);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/groups/:groupID
// @desc    Get the groups by id
// @access  Public
router.get("/:groupID", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupID);
    console.log(req.params.groupID);
    if (!group) {
      return res.status(404).json({ msg: "Group not found." });
    }
    res.json(group);
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("Cast to ObjectId failed")) {
      return res.status(400).json({ msg: "Group not found." });
    }
    res.status(500).send("Server error!");
  }
});

// @route   DELETE api/groups/:groupID
// @desc    delete a group by id
// @access  Private
router.delete("/:groupID", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupID);
    console.log(group);
    if (!group) {
      return res.status(404).json({ msg: "Group not found." });
    }
    // Check user
    if (group.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    } else {
      await group.remove();
    }

    res.json({ msg: "Group removed" });
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("Cast to ObjectId failed")) {
      return res.status(400).json({ msg: "Group not found." });
    }
    res.status(500).send("Server error!");
  }
});

// @route   PUT api/groups/:groupID
// @desc    update group settings
// @access  Private
router.put(
  "/:groupID",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let group = await Group.findById(req.params.groupID);
      if (!group) {
        return res.status(404).json({ msg: "Group not found." });
      }
      // Check user
      if (group.creator.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      } else {
        group.name = req.body.name;
        group.isPublic = req.body.isPublic;
        await group.save();
      }

      res.json({ msg: "Group info updated" });
    } catch (error) {
      console.error(error.message);
      if (error.message.includes("Cast to ObjectId failed")) {
        return res.status(400).json({ msg: "Group not found." });
      }
      res.status(500).send("Server error!");
    }
  }
);

// @route   PUT api/groups/join/:groupID
// @desc    Add a member to a group
// @access  Private
router.put("/join/:groupID", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupID);
    if (!group) {
      return res.status(404).json({ msg: "Group not found." });
    }
    // Check if user is already a member
    if (
      group.members.filter((member) => member._id.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: "Already a member!" });
    } else {
      const newMember = {
        dateJoined: Date.now(),
        _id: req.user.id,
      };
      group.members.push(newMember);
      await group.save();
      res.send(group);
    }
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("Cast to ObjectId failed")) {
      return res.status(400).json({ msg: "Group not found." });
    }
    res.status(500).send("Server error!");
  }
});

// @route   PUT api/groups/leave/:groupID
// @desc    Remove a member from a group
// @access  Private
router.put("/leave/:groupID", auth, async (req, res) => {
  try {
    let group = await Group.findById(req.params.groupID);
    if (!group) {
      return res.status(404).json({ msg: "Group not found." });
    }
    // Check user
    if (
      group.members.filter((member) => member._id.toString() === req.user.id)
        .length <= 0
    ) {
      return res.status(401).json({ msg: "Not a member!" });
    } else {
      group.members = group.members.filter(
        (member) => member._id.toString() !== req.user.id
      );
    }
    await group.save();
    res.send(group);
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("Cast to ObjectId failed")) {
      return res.status(400).json({ msg: "Post not found." });
    }
    res.status(500).send("Server error!");
  }
});

/***************************************************************************************************/


/*GET - DELETE - ADD - EDIT POSTS IN THE GROUPS*/
/***************************************************************************************************/

// @route   GET api/groups/:groupID/posts
// @desc    Get all the posts(with comments) in the particular group
// @access  Public
router.get("/:groupID/posts", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupID);
    if (!group) {
      return res.status(404).json({ msg: "Group not found." });
    }
    res.json(group.posts);
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("Cast to ObjectId failed")) {
      return res.status(400).json({ msg: "Group not found." });
    }
    res.status(500).send("Server error!");
  }
});
//  @route   POST api/groups/:groupID/posts/
//  @desc    create a post in group
//  @access  Private
router.post(
  "/:groupID/posts",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),
    check("text", "Text is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const group = await Group.findById(req.params.groupID);
      const user = await User.findById(req.user.id);
      // Check if the user is a member
      if (
        group.members.filter((member) => member._id.toString() === req.user.id)
          .length <= 0
      ) {
        return res.status(401).json({ msg: "User not Authorized" });
      } else {
        const newPost = {
          title: req.body.title,
          creator: req.user.id,
          text: req.body.text,
          avatar: user.avatar,
          date: Date.now(),
          comments: [],
        };
        group.posts.push(newPost);
        await group.save();
        res.send(group.posts);
      }
    } catch (error) {
      console.error(error.message);
      if (error.message.includes("Cast to ObjectId failed")) {
        return res.status(400).json({ msg: "Group not found." });
      }
      res.status(500).send("Server error!");
    }
  }
);

// // @route   PUT api/groups/:groupID/posts/:postID
// // @desc    update a post in group
// // @access  Private
router.put("/:groupID/posts/:postID", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupID);
    // Pull out post
    const post = group.posts.find((post) => post.id === req.params.postID);
    //  Make sure post exists
    if (!post) {
      return res.status(404).json({ msg: "Post does not exist" });
    }
    // check if the current user is authorized
    if (post.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not Authorized" });
    }
    post.title = req.body.title;
    post.text = req.body.text;
    await group.save();
    res.send("POST UPDATED");
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("Cast to ObjectId failed")) {
      return res.status(400).json({ msg: "Group not found." });
    }
    res.status(500).send("Server error!");
  }
});

// // @route   DELETE api/groups/:groupID/posts/:postID
// // @desc    delete a post in group
// // @access  Private
router.delete("/:groupID/posts/:postID", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupID);
    // Pull out post
    const post = group.posts.find((post) => post.id === req.params.postID);
    //  Make sure post exists
    if (!post) {
      return res.status(404).json({ msg: "Post does not exist" });
    }
    // check if the current user is authorized
    if (post.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not Authorized" });
    }
    // Get remove index
    const removeIndex = group.posts
      .map((post) => post.id.toString())
      .indexOf(req.params.postID);
    group.posts.splice(removeIndex, 1);

    await group.save();
    res.json(group.posts);
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("Cast to ObjectId failed")) {
      return res.status(400).json({ msg: "Group not found." });
    }
    res.status(500).send("Server error!");
  }
});

// /***************************************************************************************************/


// /*ADDING COMMENTS TO THE POSTS*/
// /***************************************************************************************************/

// // @route   PUT api/groups/:groupID/posts/:postID
// // @desc    Add a comment to the post
// // @access  Private
router.put(
  "/:groupID/posts/:postID/comments",
  [auth, [check("text", "Text is required.").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const group = await Group.findById(req.params.groupID);
      // Pull out post
      const post = group.posts.find((post) => post.id === req.params.postID);
      //  Make sure post exists
      if (!post) {
        return res.status(404).json({ msg: "Post does not exist" });
      }
      const newComment = {
        creator: req.user.id,
        text: req.body.text,
        date: Date.now(),
      };
      post.comments.push(newComment);
      await group.save();
      res.send(post.comments);
    } catch (error) {
      console.error(error.message);
      if (error.message.includes("Cast to ObjectId failed")) {
        return res.status(400).json({ msg: "Post not found." });
      }
      res.status(500).send("Server error");
    }
  }
);

// // @route   PUT api/groups/:groupID/posts/:postID/:commentID
// // @desc    Delete a comment from the post
// // @access  Private
router.put(
  "/:groupID/posts/:postID/comments/:commentID",
  auth,
  async (req, res) => {
    try {
      const group = await Group.findById(req.params.groupID);
      // Pull out post
      const post = group.posts.find((post) => post.id === req.params.postID);
      //  Make sure post exists
      if (!post) {
        return res.status(404).json({ msg: "Post does not exist" });
      }

      // Get remove index
      const removeIndex = post.comments
        .map((comment) => comment._id.toString())
        .indexOf(req.params.commentID);
      // check if user is authorized to delete the comment
      if (post.comments[removeIndex].creator.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }
      post.comments.splice(removeIndex, 1);
      await group.save();
      res.json(post.comments);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// /***************************************************************************************************/

module.exports = router;
