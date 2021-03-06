const https = require('https');
const fs = require('fs');
var express = require("express");
const {LaunchRootAPI} = require('./Util/Connection');


var multer = require('multer');
var upload = multer();
const bodyParser = require('body-parser');
require('dotenv').config();
const aws = require('aws-sdk');

const s3Bucket = new aws.S3({
    accessKeyId: "AKIA52MWJH27GHBU6FFG",
    secretAccessKey: "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"
});


// Create express app
var app = express();

app.use(express.static(__dirname + '/client'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/uploadImage', upload.single('file'), function (req, res) {
    var data = {
        Bucket: "divernowapp",
        Key: req.body.name,
        Body: req.file.buffer,
        ContentType: req.query.ContentType
    };
    s3Bucket.upload(data, function (err, data) {
        if (err) {
            console.log('Error uploading data: ', err);
        } else {
            console.log("POST response: " + JSON.stringify(data));
            res.send("Image Uploaded Successfully")
        }
    });
}); 



// const httpsServer = https.createServer(app);
// httpsServer.listen(3001, () => {
//     console.log('HTTPS Server running on port 3001');
// });

//Grab SSL Credentials & create HTTPS server on express app
var key = fs.readFileSync('/home/ec2-user/desktop/key.pem');
var cert = fs.readFileSync('/home/ec2-user/desktop/SSL/ea6c7a2b6b386fc0.pem');
var ca = fs.readFileSync('/home/ec2-user/desktop/SSL/gdig2.crt.pem');
const httpsServer = https.createServer({
    key: key,
    cert: cert,
    ca: ca,
}, app);


// Launch Root API on express app
LaunchRootAPI(app);
//*********************************************************************************************************************************** */
const socketio = require('socket.io');
const {pool} = require('./Util/Connection');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
  } = require('./Util/users');
  const formatMessage = require('./Util/messages');
  const chatController=require('./Controller/chatController')
//*********************************************************************************************************************************** */
//*********************************************************************************************************************************** */
//socket server running here


const botName = 'ChatCord Bot';
var typingUsers = {};
// Run when client connects
io.on('connection', socket => {

    console.log("---------------------------------------online user---------------------------------------------,",socket.handshake.query['user_id']);


    chatController.updateOnlineStatus(socket.handshake.query['user_id'],pool,1);

    socket.on('joinRoom', async({ from_user_id, to_user_id }) => {

    
      var room_id=await chatController.saveRoom(from_user_id, to_user_id,pool);
      
      const user = userJoin(socket.id, from_user_id, to_user_id,room_id);

      
      socket.join(user.room);
      const user1 = getCurrentUser(socket.id);
      
     
      
    });
  
    // Listen for chatMessage
    socket.on('chatMessage', ({ msg}) => {
      const user = getCurrentUser(socket.id);
      const userName = user.username;

      // console.log("typingUsers:", typingUsers[userName] = 1, "user:", user)
      delete typingUsers[userName];

      chatController.saveMessage(user,msg,pool);
      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //TypingUsers
    socket.on("startType", () => {
      const user = getCurrentUser(socket.id);
      console.log("User " + user + " is writing a message...");

      const userName = user.username;
      typingUsers[userName] = 1;
      io.to(user.room).emit("userTypingUpdate", typingUsers);
    });
  
  
    socket.on("stopType", () => {
      const user = getCurrentUser(socket.id);
      console.log("User " + user + " has stopped writing a message...");
      const userName = user.username;
      delete typingUsers[userName];
      io.to(user.room).emit("userTypingUpdate", typingUsers);
    });
   
  
    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
      const userName = user.username;
     
      delete typingUsers[userName];
     
      chatController.updateOnlineStatus(socket.handshake.query['user_id'],pool,0);
  
      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.username} has left the chat`)
        );
  
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });

  //socket programs end
  //*********************************************************************************************************************************** */

  