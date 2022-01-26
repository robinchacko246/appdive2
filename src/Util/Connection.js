var mysql = require("mysql");
const {
    GetLoginInfo,
    GetRegister,
    Login,
} = require('./Connection/Account');
const {
    GetBlock,
} = require('./Connection/Users');
const {
    GetPost,
    GetUserPosts,
    GetIncrement,
    GetAddPost,
    GetDelete,
    GetPostForMobile,
    getCommentsOfPost,
    addLike,
    unLike,
    addComment,
    updateComment,
    deleteComment,
    GetAddPostMobile,
    getLikesOfPost,
    getProfileDetails,
    FollowUser,
    UnfollowUser,
    updateProfile

} = require('./Connection/Posts');
//chat controlls
const {
    allMessages,
    getMessages,
    updateReadStatus,
    getOnlineUsers
}= require('../Controller/chatController')




// Create connection pool to DB
var pool  = mysql.createPool({
    host: "divernowapp.cfnbqq8edyon.us-east-1.rds.amazonaws.com",
    user: "divernowapp",
    password: "Petertbmx477",
    database: "divernowapp",
    timeout: 60000,
    port: 3306,
    debug: true,
});

// Launches a single endpoint for the server. Connects to the DB for
// given function so function given should query on given con
// Input : ExpressApp String ((con, req, res) => nil)
// Return: Nil
const LaunchEndpoint = function(app, name, f) {
  
    app.get(name, function(req, res) {
        // Establish connection to DB
        pool.getConnection(async function(err, con) {
            if (err) {
                console.log(err);
                res.send('{"error":"something wrent wrong."} ', 400);
                con.release();
                return;
            }
            try {
                // Do API call
                await f(con, req, res); /* Make sure to release connection inside API call */
            } catch (err) {
                console.log(err);
                res.send('{"error":"something went wrong."} ', 400);
                con.release();
            }
        });
    });
}

// Launches entire API on provide express app
// Input : ExpressApp
// Return: Nil
module.exports.LaunchRootAPI = function(app) {
    // Account
    LaunchEndpoint(app, "/getLoginInfo", GetLoginInfo);
    LaunchEndpoint(app, "/getRegister", GetRegister);
    LaunchEndpoint(app, "/login", Login);

    // User
    LaunchEndpoint(app, "/getBlock", GetBlock);

    // Posts
    LaunchEndpoint(app, "/getPost", GetPost);
    LaunchEndpoint(app, "/getUserPosts", GetUserPosts);
    LaunchEndpoint(app, "/getIncrement", GetIncrement);
    LaunchEndpoint(app, "/getAddPost", GetAddPost);
    LaunchEndpoint(app, "/getDelete", GetDelete);

    //mobile apis

    LaunchEndpoint(app, "/getPostForMobile", GetPostForMobile);  //news feeds api 
    LaunchEndpoint(app, "/getCommentsOfPost", getCommentsOfPost);  //news feeds api 
    LaunchEndpoint(app, "/getLikesOfPost", getLikesOfPost);  //news feeds api 

    LaunchEndpoint(app, "/addLike", addLike);  //like api 
    LaunchEndpoint(app, "/unLike", unLike);  //unlike api 

   LaunchEndpoint(app, "/addComment", addComment);  //addComments
   LaunchEndpoint(app, "/updateComment", updateComment);  //updateComments
   LaunchEndpoint(app, "/deleteComment", deleteComment);  //updateComments
   //LaunchEndpoint(app, "/getAddPostMobile", GetAddPostMobile); 
   LaunchEndpoint(app, "/allMessages/:user_id", allMessages);  //get all messages corresponding user id
   LaunchEndpoint(app, "/room", getMessages);  //get all messages corresponding user id
   LaunchEndpoint(app, "/updateReadStatus", updateReadStatus);  //update msg read status
   LaunchEndpoint(app, "/getOnlineUSers", getOnlineUsers);  //get all messages corresponding user id
   //profile page api
   LaunchEndpoint(app, "/getProfileDetails/:user_id", getProfileDetails);  //get all details corresponding user id
   LaunchEndpoint(app, "/followUser", FollowUser);  //update follow stats
   LaunchEndpoint(app, "/unfollowUser", UnfollowUser);  //update follow stats
   LaunchEndpoint(app, "/updateProfile", updateProfile);
   

}

module.exports.pool=pool;