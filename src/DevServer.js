var express = require("express");
const https = require('http');
const { LaunchRootAPI } = require('./Util/Connection');
var multer = require('multer');
var upload = multer();
const bodyParser = require('body-parser');

require('dotenv').config();
const aws = require('aws-sdk');
// Create express app & start listening on HTTP
var app = express();

// S3

// const SESConfig = {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     accessSecretKey: process.env.AWS_SECRET_KEY,

// }
// AWS.config.update(SESConfig);
// const s3Bucket = new AWS.S3();
const s3Bucket = new aws.S3({
  accessKeyId: "AKIA52MWJH27GHBU6FFG",
  secretAccessKey: "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"
});

app.use(express.static(__dirname + '/client'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// app.use(bodyParser())
app.use(function (req, res, next) {
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

// app.listen(3000, () => {
//     console.log('HTTP Server running on port 3000');
// })
const PORT = process.env.PORT || 3000
const httpsServer = https.createServer(app);
httpsServer.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`);
});

// Launch Root API on express app
LaunchRootAPI(app);
//*********************************************************************************************************************************** */
const socketio = require('socket.io');
const { pool } = require('./Util/Connection');
const {
  userJoin,
  getUser,
  userLeave,
  getRoomUsers
} = require('./Util/users');
const formatMessage = require('./Util/messages');
const chatController = require('./Controller/chatController')
//*********************************************************************************************************************************** */
//*********************************************************************************************************************************** */
//socket server running here

const io = socketio(httpsServer);

var typingUsers = {};
// Run when client connects
io.on('connection', socket => {

  console.log("---------------------------------------online user---------------------------------------------,", socket.handshake.query['user_id']);


  chatController.updateOnlineStatus(socket.handshake.query['user_id'], pool, 1);

  //AT THE TIME OF USER LOGIN CALL THIS EMITTER FROM CLIENT

  socket.on('login', async ({ user_id }) => {

  await userJoin(socket.id, user_id);

  });

  //WHEN USER-A WANT TO CHAT WITH USER-B  CALL JOINROOM EMITTER FROM CLIENT

  socket.on('joinRoom', async ({ from_user_id, to_user_id }) => {
  
     
     let userNames=await chatController.getUserNames(from_user_id, pool);
     const user = await getUser(to_user_id);
     
     user? socket.broadcast.to(user.id).emit(userNames[0].nameUser+"invited to chat"):"" ;
     
  });

  // LISTEN FOR chatMessage EMITTER FROM CLIENT

  socket.on('chatMessage', async ({ from_user_id, to_user_id, msg }) => {

    let user = await getUser(to_user_id);
    
   
    
    let room = await chatController.saveRoom(from_user_id, to_user_id, pool);
  
    await chatController.saveMessage(from_user_id, to_user_id, room, msg, pool);  //SAVE MESSAGE TO DB 

    if (!user) return 0;

    const user_id = user.user_id;
    delete typingUsers[user_id];
    io.to(user.id).emit('message', formatMessage(user.user_id, msg));
    io.to(user.id).emit('getNotification', formatMessage(user.user_id, msg));
  });

  //notification to users

  // socket.on('sendNotification', ({ msg}) => {
  //   const user = getUser(socket.id);
  //   const reciever=user.room;
  //   io.to(reciever).emit('sendNotification', formatMessage(user.username, msg));

  // });

  //TypingUsers
  socket.on("startType", (from_user_id, to_user_id) => {
    const user = getUser(to_user_id);
    if (!user) return 0;
    console.log("User " + user + " is writing a message...");

    const user_id = user.user_id;
    typingUsers[user_id] = 1;
    io.to(user.id).emit("userTypingUpdate", typingUsers);
  });


  socket.on("stopType", (from_user_id, to_user_id) => {
    const user = getUser(to_user_id);
    if (!user) return 0;
    console.log("User " + user + " has stopped writing a message...");
    const user_id = user.user_id;
    delete typingUsers[user_id];
    io.to(user.id).emit("userTypingUpdate", typingUsers);
  });

  // Runs when client disconnects
  socket.on('disconnect', async() => {
   
    const user = await userLeave(socket.id);
    
    if(user)
    {
      const from_user_id = user.user_id;

      delete typingUsers[from_user_id];
  
      await chatController.updateOnlineStatus(socket.handshake.query['user_id'], pool, 0);
      let userNames=await chatController.getUserNames(from_user_id, pool);

  
      if (userNames[0].nameUser) {
        io.to(user.id).emit(
          'disconnectEmitter',
          formatMessage( `${userNames[0].nameUser} has left the chat`)
        );
  
        // Send users and room info
        // io.to(user.id).emit('roomUsers', {
        //   room: user.id,
        //   users: getRoomUsers(user.id)
        // });
      }
    }
   
  });
});

  //socket programs end
  //*********************************************************************************************************************************** */