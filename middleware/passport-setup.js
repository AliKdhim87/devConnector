const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const generateRandomPass = name => {
  return `${name}123`;
};

const checkAndCreateUser = async (accessToken, refreshToken, profile, done, account) => {
  const {
    id: socialId,
    displayName: name,
    username,
    emails: [{ value: email }],
    photos: [{ value: avatar }],
  } = profile;

  try {
    // Check if user is already registered
    let user = await User.findOne({ email });
    // if not proceed and save
    if (!user) {
      const password = generateRandomPass(name + socialId);

      user = new User({
        name: name || username,
        email,
        avatar,
        password,
        social: {
          [account]: socialId,
        },
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    user.isConfirmed = true;
    user.social[account] = socialId;
    await user.save();


    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      done(null, token);
    });
  } catch (err) {
    done(err, null);
  }
};

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.get('googleClientId'),
      clientSecret: config.get('googleSecret'),
      callbackURL: 'http://localhost:5000/api/social/google/redirect',
    },
    (accessToken, refreshToken, profile, done) =>
      checkAndCreateUser(accessToken, refreshToken, profile, done, 'google')
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: config.get('facebookClientId'),
      clientSecret: config.get('facebookSecret'),
      callbackURL: 'http://localhost:5000/api/social/facebook/redirect',
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    (accessToken, refreshToken, profile, done) =>
      checkAndCreateUser(accessToken, refreshToken, profile, done, 'facebook')
  )
);

// Github Strategy
passport.use(
  new GithubStrategy(
    {
      clientID: config.get('githubClientId'),
      clientSecret: config.get('githubSecret'),
      callbackURL: 'http://localhost:5000/api/social/github/redirect',
      scope: 'user:email',
    },
    (accessToken, refreshToken, profile, done) =>
      checkAndCreateUser(accessToken, refreshToken, profile, done, 'github')
  )
);