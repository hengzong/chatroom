express = require('express');
router = express.Router();
Message = require('../models/Message');

router.post('/', function(req, res) {
  var user_name = req.body.user_name || "";
  var message = req.body.message || "";

  if ( !user_name ) {
    res.status(400);
    return res.json({
      message: "User name is empty.",
      data: {}
    })
  }

  new_message = new Message({user_name: user_name, message: message});

  new_message.save(function(err, message) {
    if (err) {
      res.status(500);
      var message = err.errmsg || err;
      return res.json({
        message: message,
        data: {}
      });
    } else {
      res.status(201);
      return res.json({
        message: "created",
        data: message
      })
    }
  })
});

router.get('/', function(req, res) {
  var user_name = req.query.user_name || "";
  var filter = {};
  if (user_name !== "") {
    filter = {user_name: user_name};
  }
  Message.find(filter, function(err, messages) {
    if (err) {
      res.status(500);
      return res.json({
        message: err.errmsg || err,
        data: {}
      });
    }

    res.status(200);
    return res.json({
      message: "ok",
      data: messages
    })
  })
})

module.exports = router
