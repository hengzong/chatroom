express = require('express');
router = express.Router();
User = require('../models/User');
var config = require('../config');
var jwt = require('jsonwebtoken');


router.post('/', function(req, res) {
  var user_name = req.body.user_name || "";
  var password = req.body.password || "";

  if ( (!user_name) || (!password) ) {
    res.status(400);
    return res.json({
      message: "Need both user name and password.",
      data: {}
    })
  }

  new_user = new User({user_name: user_name, password: password});

  new_user.save(function(err, user) {
    if (err) {
      res.status(500);
      var message = err.errmsg || err;
      return res.json({
        message: message,
        data: {}
      });
    } else {
      var token = jwt.sign({ user_name: user.user_name }, config.secret, {expiresIn: 86400});
      res.status(201);
      return res.json({
        message: "created",
        data: user,
        token: token
      })
    }
  })
});

router.get('/', function(req, res) {
  var user_name = req.query.user_name || "";
  var password = req.query.password || "";
  var check_repeat = req.query.check_repeat || "";

  var filter = {};
  if (user_name !== "") {
    filter = {user_name: user_name};
  }
  User.findOne(filter, function(err, user) {
    if (err) {
      res.status(500);
      return res.json({
        message: err.errmsg || err,
        data: {}
      });
    }

    res.status(200);
    console.log(user);
    if (check_repeat) {
      return res.json({
        message: "ok",
        data: (user !== null)
      })
    } else if (password) {
      if (user != null && password == user.password) {
        var token = jwt.sign({ user_name: user.user_name }, config.secret, {expiresIn: 86400});
        return res.json({
          message: "ok",
          data: [user],
          token: token
        })
      } else {
        return res.json({
          message: "user name and password does not match",
          data: []
        })
      }
    } else {
      return res.json({
        message: "",
        data: {}
      })
    }

  })
})

module.exports = router
