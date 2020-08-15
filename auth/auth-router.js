const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const secrets = require('../config/secrets.js');
const Users = require('../users/users-model.js');
const { isValid } = require('../users/users-services.js');

router.post("/register", (req, res) => {
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;

    // hashing the password
    const hash = bcrypt.hashSync(credentials.password, rounds);
    credentials.password = hash;

    // save the user to the database
    Users.add(credentials)
      .then((user) => {
        const token = generateToken(user);
        res.status(201).json({
          data: user,
          jwt_token: token
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message
        });
      });
  } else {
    res.status(400).json({
      message:
      'Please provide a username and password (password must be alpha numeric).',
    });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        // compare the password to the hash in the database.
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({
            message: `Welcome, ${username}!`,
            jwt_token: token,
          });
        } else {
          res.status(401).json({
            message: 'You shall not pass!'
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message
        });
      });
  } else {
    res.status(400).json({
      message:
      'Please provide a username and password (password must be alpha numeric).',
    });
  };
});

function generateToken(user) {
  const payload = {
      subject: user.id,
      username: user.username,
      role: user.role
  };

  const secret = secrets.jwtSecret;
  
  const options = {
      expiresIn: '1h'
  };

  return jwt.sign(payload, secret, options);
};

module.exports = router;
