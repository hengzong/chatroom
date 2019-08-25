//https://medium.com/javascript-in-plain-english/full-stack-mongodb-react-node-js-express-js-in-one-simple-app-6cc8ed6de274
Message = require('./models/Message');

const mongoose = require('mongoose');
const express = require('express');
const http = require("http");
const bodyParser = require('body-parser');
const socketIO = require("socket.io");
// const logger = require('morgan');
var cors = require('cors');

const API_PORT = 3001;
const app = express();

const router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('./config');

// this is our MongoDB database
const dbRoute =
  'mongodb+srv://hengzong:db123456@cluster0-dtwc0.mongodb.net/test?retryWrites=true&w=majority';

// connects our backend code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

require('./routes')(app, router);

const server = http.createServer(app);
const io = socketIO(server);
// const collection_messages = db.get("Messages");

io.on("connection", socket => {
  console.log("New client connected: " + socket.id);

  socket.on("initial_data", () => {
    Message.find({}).then((docs) => {
      io.sockets.emit("get_data", docs);
    });
  });

  socket.on("newMessage", (doc) => {
    console.log("newMessage: " + doc.token);
    try {
      var decoded = jwt.verify(doc.token, config.secret);
      console.log(decoded);
    } catch(err) {
      console.log(err);
      socket.emit("unauthed");
    }

    new_message = new Message({user_name: doc.user_name, message: doc.message});
    new_message.save((err, doc) => {
      if (err) {
        console.log(err);
      } else {
        console.log(doc);
        io.sockets.emit("update_data", doc);
      }
    })
  });

  socket.on("disconnect", () => {
    console.log("user disconnected: " + socket.id);
  });
});

// launch our backend into a port
server.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
