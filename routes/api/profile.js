const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Posts");
const githubId = config.get("githubClientId");
const githubSecret = config.get("githubSecret");
// @route   GET api/profile/me
// @desc    Get curent users profile
// @access  Privet
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for this user." });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error!");
  }
});
// @route   POST api/profile
// @desc    Create or update user profile
// @access  Privet

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required.").not().isEmpty(),
      check("skills", "Skills is required.").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ errors: erros.array() });
    }
    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;
    // Build Profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      // Create Profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error!");
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error!");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) return res.status(400).json({ msg: "Profile not found." });
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("Cast to ObjectId failed")) {
      return res.status(400).json({ msg: "Profile not found." });
    }
    res.status(500).send("Server error!");
  }
});

// @route   DELETE api/profile
// @desc    Delete profiles, user, posts
// @access  Private

router.delete("/", auth, async (req, res) => {
  try {
    // Remove Posts
    await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //  Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error!");
  }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
  "/experience",
  [
    auth,
    [check("title", "Title is required.").not().isEmpty()],
    check("company", "Company is required.").not().isEmpty(),
    check("from", "From date is required.").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      from,
      location,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error!");
    }
  }
);
// @route   DELETE api/profile/experience/:exp_id
// @desc   Delete profile experience
// @access  Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error!");
  }
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
  "/education",
  [
    auth,
    [check("school", "School is required.").not().isEmpty()],
    check("degree", "Degree is required.").not().isEmpty(),
    check("fieldofstudy", "Field of study is required.").not().isEmpty(),
    check("from", "From date is required.").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      location,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      location,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error!");
    }
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc   Delete profile education
// @access  Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error!");
  }
});

// @route   GET api/profile/github/:username
// @desc    Get user's repos from GitHub
// @access  Public
router.get("/github/:username", async (req, res) => {
  const option = {
    uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id${githubId}&client_secret${githubSecret}`,
    method: "GET",
    headers: { "user-agent": "node.js" },
  };
  request(option, (error, response, body) => {
    if (error) console.log(error);
    if (response.statusCode !== 200) {
      return res.status(404).json({ msg: "No Github profile found" });
    }
    res.json(JSON.parse(body));
  });
  try {
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error!");
  }
});
module.exports = router;
