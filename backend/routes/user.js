express = require('express');
router = express.Router({mergeParams: true});
User = require('../models/User');
var jwt = require('jsonwebtoken');
var config = require('../config');

router.get('/', function(req, res) {
  var user_name = req.params.name || "";
  var token = req.query.token;

  if (!user_name) {
    res.status(400);
    return res.json({
      message: "user_name is empty.",
      data: {}
    })
  }

  User.findOne({user_name: user_name}, function(err, user) {
    if (err) {
      res.status(500);
      return res.json({
        message: err.errmsg || err,
        data: {}
      });
    }

    if (! user) {
      res.status(404);
      return res.json({
        message: "user_name is incorrect.",
        data: {}
      })
    }

    try {
      var decoded = jwt.verify(token, config.secret);
      res.status(200);
      return res.json({
        message: "ok",
        data: user
      });
    } catch(err) {
      console.log(err);
      res.status(403);
      return res.json({
        message: "not authorized",
        data: {}
      })
    }

  })
})

router.put('/', function(req, res) {
  var user_name = req.params.name || "";
  var loggedIn = req.body.loggedIn || false;


  if (!user_name) {
    res.status(400);
    return res.json({
      message: "user_name is empty.",
      data: {}
    })
  }

  User.findOneAndUpdate ({user_name: user_name}, {loggedIn: loggedIn}, {useFindAndModify: false}, function(err, user) {
    if (err) {
      res.status(500);
      return res.json({
        message: err.errmsg || err,
        data: {}
      });
    }

    if (! user) {
      res.status(404);
      return res.json({
        message: "user_name is incorrect.",
        data: {}
      })
    }

    res.status(200);
    return res.json({
      message: "updated",
      data: user
    })
  })

})

module.exports = router;
