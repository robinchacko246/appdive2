/************************
 * REST API INTERACTION *
 * ******************** */

/**
 * README FOR REST API INTERACTION:
 * 
 * Process for checking return type and grabbing data:
 *      * Grab return value
 *      * Make sure res.statusCode == 200
 *      * Grab res.body for the body of the return type (usually an array of objects)
 *      
 *      * Sample return object:
 *          {statusCode: 200, body: "[{"idUser":54}]", headers: {…}, request: {…}}
 *  
 */
// var webUrl = "https://divernowapp.com"; // "http://ec2-100-25-220-250.compute-1.amazonaws.com:8080"; 
var webUrl = "https://divernow-backend-heroku.herokuapp.com"; //"http://localhost:3000";


/**
 * Get user login information based on username and password
 * 
 * String username: 
 * String password:
 * 
 * @returns body: [{"idUser":4,"nameUser":"a","passwordUser":"a","emailUser":"@","incrementUser":9}]
 */
function login(username, password) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: webUrl + "/login",
            data: {
                username: username,
                password: password
            },
            dataType: "json",
            success: function (e) {
                console.log("Success!")
                console.log(e)
                resolve(e)
            },
            error: function (e) {
                console.log("Running Error!")
                console.log(e)
                resolve(e)
            }
        });
    })
}

/**
 * Register a user and get back their userId
 * 
 * String username:
 * String password:
 * String email:
 * 
 * @returns body: [{"idUser":54}]
 */
function getRegister(username, password, email) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: webUrl + "/getRegister",
            data: {
                username: username,
                password: password,
                email: email
            },
            dataType: "json",
            success: function (e) {
                console.log("Success!")
                console.log(e)
                resolve(e)
            },
            error: function (e) {
                console.log("Running Error!")
                console.log(e)
                resolve(e)
            }
        });
    })
}

/**
 * Block a user
 * 
 * int userid: your userid
 * ind blockedidUser: the id of the user you want to block
 * 
 * @returns TODO this crashes the server
 */
function getBlock(userid, blockedidUser) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: webUrl + "/getBlock",
            data: {
                userid: userid,
                blockedidUser: blockedidUser
            },
            dataType: "json",
            success: function (e) {
                console.log("Success!")
                console.log(e)
                resolve(e)
            },
            error: function (e) {
                console.log("Running Error!")
                console.log(e)
                resolve(e)
            }
        });
    })
}

/** 
 * Get all posts
 * 
 * int userid: Your userid
 * Datetime recenttime: the last time you loaded all posts
 */
function getPost(userid, recenttime) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: webUrl + "/getPost",
            data: {
                userid: userid,
                recenttime: recenttime
            },
            dataType: "json",
            success: function (e) {
                console.log("Success!")
                console.log(e)
                resolve(e)
            },
            error: function (e) {
                console.log("Running Error on getPost!")
                console.log(e)
                resolve(e)
            }
        });
    })
}

/**
 * TODO untested until REST API works
 * Get the increment value for that user
 * 
 * int userid: your userid
 * 
 * @returns int incrementor
 */
function getIncrement(userid) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: webUrl + "/getIncrement",
            data: {
                userid: userid
            },
            dataType: "json",
            success: function (e) {
                console.log("Success! getIncrement")
                console.log(e);
                resolve(e)
            },
            error: function (e) {
                console.log("Running Error on getIncrement!")
                console.log(e)
                resolve(e)
            }
        });
    })
}

/**
 * TODO untested until REST API works
 * Add a post to the database
 * 
 * String title: title
 * String description: description
 * double currentLongitude: longitude value
 * double currentLatitude: lat value
 * String pictureAddress: the url of the picture
 *      Locally, you will have to build this value. The process for building this value is as follows:
 * 
 *          * First you need to get your <incrementor> value - this keeps track of how many posts you've made
 *          * "https://divernowapp.s3.us-east-2.amazonaws.com/ + myId + "-" + <incrementor> + ".jpg"
 * 
 * int userid: the user's id
 */

function getAddPost(title, description, currentLongitude, currentLatitude, pictureAddress, userid) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: webUrl + "/getAddPost",
            data: {
                title: title,
                description: description,
                currentLongitude: currentLongitude,
                currentLatitude: currentLatitude,
                pictureAddress: pictureAddress,
                userid: userid
            },
            dataType: "json",
            success: function (e) {
                console.log("Success!")
                console.log(e)
                resolve(e)
            },
            error: function (e) {
                console.log("Running Error on getAddPost!")
                console.log(e)
                resolve(e)
            }
        });
    })
}

// * Upload Image

// ! File: HTMLInputElement type(file), name: FileName

function uploadImage(file, name) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name)
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: webUrl + "/uploadImage",
            data: formData,
            processData: false,
            contentType: false,
            success: function (e) {
                console.log("Success image upload!")
                console.log(e);
                resolve(e)
            },
            error: function (e) {
                console.log("Running Error on Upload Image")
                console.log(e)
                reject(e)
            }
        });
    })
}

/*
* Get user posts
 * 
 * int userid: Your userid
*/
function getUserPosts(userid) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: webUrl + "/getUserPosts",
            data: {
                userid: userid
            },
            dataType: "json",
            success: function (e) {
                console.log("Success!")
                console.log(e)
                resolve(e)
            },
            error: function (e) {
                console.log("Running Error on getUserPost!")
                console.log(e)
                reject(e)
            }
        });
    })
}

/*
* Get user posts
 * 
 * int userid: Your userid
*/
function deleteUserPosts(postid) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: webUrl + "/getDelete",
            data: { postid },
            dataType: "json",
            success: function (e) {
                console.log("Success!")
                console.log(e)
                resolve(e)
            },
            error: function (e) {
                console.log("Running Error on getUserPost!")
                console.log(e)
                resolve(e)
            }
        });
    })
}

// get loginInfo here
// This is used for getting the username to put it on the post popup
/** 
 * Get all posts
 * 
 * int userid: Your userid
 * Datetime recenttime: the last time you loaded all posts
 */

 function getLoginInfo(userid) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: webUrl + "/getLoginInfo",
            data: {
                userid: userid
            },
            dataType: "json",
            success: function (e) {
                console.log("Success!")
                console.log(e)
                resolve(e)
            },
            error: function (e) {
                console.log(e)
                resolve(e)
            }
        });
    })
}