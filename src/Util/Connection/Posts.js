/**
 * Get all posts
 *
 * int userid: Your userid
 * Datetime recenttime: the last time you loaded all posts
 */
 module.exports.GetPost = async function (con, req, res) {
    // Get input from body
    var userid = req.query.userid;
    var recenttime = req.query.recenttime;
    // Query the database
    con.query(
        "SELECT Post.* FROM Post WHERE Post.timePost > '" +
        recenttime +
        "' AND Post.idUser IN ( " +
        " SELECT Users.idUser FROM Users WHERE Users.idUser <> " +
        userid +
        " AND Users.idUser  NOT IN (SELECT blockedidBlockUser FROM BlockedUser WHERE blockedidUser = " +
        userid +
        ")" +
        " AND Users.idUser NOT IN (SELECT blockedidUser FROM BlockedUser WHERE blockedidBlockUser = " +
        userid +
        ")" +
        " UNION " +
        "SELECT Users.idUser FROM Users WHERE Users.idUser = " +
        userid +
        ");",
        function (err, result, fields) {
            con.release();
            if (err) {
                res.send('{"error":"no new posts."} ', 400); // If it sends an error, this line will be sent
            } else {
                res.send(JSON.stringify(result), 200);
            }
        }
    );
}

/**
 * Get all posts for one user
 *
 * int userpostid: the id of the user whose posts you want to get
 **/
module.exports.GetUserPosts = async function (con, req, res) {
    // Get input from body
    var userid = req.query.userid;
    // Query the database
    con.query(
        "SELECT Post.* FROM Post WHERE Post.idUser = " + userid + ";",
        function (err, result, fields) {
            con.release();
            if (err) {
                res.send('{"error": ' + err + " } ", 400); // If it sends an error, this line will be sent
            } else {
                res.send(JSON.stringify(result), 200);
            }
        }
    );
}

/**
 * Get the increment value for that user
 *
 * int userid: your userid
 *
 * @returns int incrementor
 */
module.exports.GetIncrement = async function (con, req, res) {
    // get input from body
    var userid = req.query.userid;
    // query the database
    con.query(
        "SELECT incrementUser FROM Users WHERE Users.idUser = " + userid + ";",
        function (err, result, fields) {
            con.release();
            if (err) {
                res.send('{"status": "increment failure"} ', 400);
            } else {
                res.send(JSON.stringify(result), 200);
            }
        }
    );
}

/**
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
// New and hopefully working verison
module.exports.GetAddPost = async function (con, req, res) {
    // get input from body
    var title = req.query.title;
    var description = req.query.description;
    var currentLongitude = req.query.currentLongitude;
    var currentLatitude = req.query.currentLatitude;
    var pictureAddress = req.query.pictureAddress;
    var userid = req.query.userid;
    // query the database
    con.query(
        "INSERT INTO Post (titlePost, descriptionPost, longitudePost, latitudePost, picturePost, idUser, timepost) " +
        "VALUES ( '" +
        title +
        "', '" +
        description +
        "', " +
        currentLongitude +
        ", " +
        currentLatitude +
        ", '" +
        pictureAddress +
        "', " +
        userid +
        ", now());",
        function (err, result, fields) {
            if (err) {
                con.release();
                res.send('{"status":"failure"} ', 400);
            } else {
                //if (result[0].affectedRows == 1) { //TODO jack?
                //     res.send("{\"status\":\"success\"} ");
                // } else { //TODO why do this here?
                con.query(
                    "SELECT Users.incrementUser FROM Users WHERE Users.idUser = " +
                    userid +
                    ";",
                    function (err, result, fields) {
                        if (err) {
                            con.release();
                            res.send('{"status":"failure"} ');
                        } else {
                            // increment the result
                            // console.log("This is the print message: " + result[0].incrementUser);
                            var increment = result[0].incrementUser + 1;
                            con.query(
                                "UPDATE Users SET Users.incrementUser = '" +
                                increment +
                                "' WHERE Users.idUser = " +
                                userid +
                                ";",
                                function (err, result, fields) {
                                    con.release();
                                    if (err) {
                                        res.send('{"status":"failure"} ');
                                    } else {
                                        // if (result[0].affectedRows == 1) {
                                        res.send('{"status":"success"} ');
                                        // } else {
                                        // res.send("{\"status\":\"failure\"} ");
                                        // }
                                    }
                                }
                            );
                        }
                    }
                );
                // }
            }
        }
    );
}

/**
 * Delete a post
 *
 * int postid: the post id to be deleted
 */
module.exports.GetDelete = async function (con, req, res) {
    // get input from body
    var postid = req.query.postid;
    // query the database
    con.query(
        "DELETE FROM `divernowapp`.`Post` WHERE (`idPost` = '" + postid + "');",
        function (err, result, fields) {
            con.release();
            if (err) {
                res.send('{"status": "increment failure"} ', 400);
            } else {
                res.send('{"status":"success"} ', 200);
            }
        }
    );
}


//Mobile APIS

module.exports.GetPostForMobile = async function (con, req, res) {  //get post,likes count,comments count
    // Get input from body
    // var userid = req.query.userid;
    // var recenttime = req.query.recenttime;
    // Query the database
    con.query(
        `SELECT * ,(SELECT COUNT(*) FROM likes l WHERE l.post_id=Post.idPost and l.like=1) AS likeCount,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id=Post.idPost and c.is_deleted=0) AS commentCount FROM Post join Users u on Post.idUser=u.idUser`,
        function (err, result, fields) {
            con.release();
            if (err) {
                res.send('{"error":"no new posts."} ', 400); // If it sends an error, this line will be sent
            } else {
                res.send(JSON.stringify(result), 200);
            }
        }
    );
}


module.exports.getCommentsOfPost = async function (con, req, res) {  //get comments
    // Get input from body
    var postId = req.query.postid;

    // Query the database
    con.query(
        `select c.*,u.* from comments c join Post p on p.idPost=c.post_id 
        join Users u on c.user_id=u.idUser
        where c.post_id=${postId} and c.is_deleted=0`,

        function (err, result, fields) {
            con.release();
            if (err) {
                res.send('{"error":"comment error."} ', 400); // If it sends an error, this line will be sent
            } else {
                res.send(JSON.stringify(result), 200);
            }
        }
    );
}

module.exports.addLike = async function (con, req, res) {  //add like
    // Get input from body
    let postId = req.query.postid;
    let userId = req.query.userid;
    // Query the database
    con.query(`select * from likes l where l.user_id=${userId} and l.post_id=${postId} and l.like=1`, function (err, alreadyLiked, fields) {

        if (alreadyLiked.length == 0) {
            con.query(
                `insert into likes (user_id,post_id) values (${userId},${postId})`,

                function (err, result, fields) {
                    con.release();
                    if (err) {
                        res.send('{"error":"like error."} ', 400); // If it sends an error, this line will be sent
                    } else {
                        res.send(JSON.stringify(result), 200);
                    }
                }
            );
        }
        else {
            res.send('{"message":"Already Liked."} ', 200); // If it sends an error, this line will be sent

        }


    });


}
module.exports.unLike = async function (con, req, res) {  //unlike
    // Get input from body
    let postId = req.query.postid;
    let userId = req.query.userid;
    // Query the database
    con.query(
        `update likes l set l.like=0 where user_id=${userId} and post_id=${postId}`,

        function (err, result, fields) {
            con.release();
            if (err) {
                res.send('{"error":"unlike error."} ', 400); // If it sends an error, this line will be sent
            } else {
                res.send(JSON.stringify(result), 200);
            }
        }
    );
}


module.exports.addComment = async function (con, req, res) {  //add comment
    // Get input from body
    let postId = req.query.postid;
    let userId = req.query.userid;
    let comment = req.query.comment;

    // Query the database
    con.query(
        `insert into comments (user_id,post_id,comment) values (${userId},${postId},${comment})`,

        function (err, result, fields) {
            con.release();
            if (err) {
                res.send('{"error":"comment error."} ', 400); // If it sends an error, this line will be sent
            } else {
                res.send(JSON.stringify(result), 200);
            }
        }
    );


}

module.exports.updateComment = async function (con, req, res) {  //using for  updation comments
    // Get input from body
    let postId = req.query.postid;
    let userId = req.query.userid;
    let comment = req.query.comment || "";


    comment == '' ? res.send('{"error":"parameter error"} ', 400) : "";
    con.query(
        `update comments c set c.comment=${comment} where user_id=${userId} and post_id=${postId}`,

        function (err, result, fields) {
            con.release();
            if (err) {
                res.send('{"error":"unlike error."} ', 400); // If it sends an error, this line will be sent
            } else {
                res.send(JSON.stringify(result), 200);
            }
        }
    );


}
module.exports.deleteComment = async function (con, req, res) {  //using for  updation comments
    // Get input from body
    let postId = req.query.postid;
    let userId = req.query.userid;

    let isDeleted = req.query.isDeleted || 0;

    // Query the database
    con.query(
        `update comments c set c.is_deleted=${isDeleted} where user_id=${userId} and post_id=${postId}`,

        function (err, result, fields) {
            con.release();
            if (err) {
                res.send('{"error":"comment deletion  error."} ', 400); // If it sends an error, this line will be sent
            } else {
                res.send(JSON.stringify(result), 200);
            }
        }
    );
}
module.exports.GetAddPostMobile = async function (con, req, res) {  //not requird api for now
    // get input from body
    //var title = req.query.title;
    var description = req.query.description.toString();
    var currentLongitude = req.query.currentLongitude.toString();
    var currentLatitude = req.query.currentLatitude.toString();
    var pictureAddress = req.query.pictureAddress.toString();
    var userid = req.query.userid;
    let tagUsers = req.query.tagUsers;
    if (tagUsers != '') {
        tagUsers = tagUsers.split(',').map(x => x);
    }

    // query the database

    con.query(`INSERT INTO Post ( descriptionPost, longitudePost, latitudePost, picturePost, idUser, timepost) values (${description},${currentLongitude},${currentLatitude},${pictureAddress},${userid},now())`

        ,

        function (err, result, fields) {
            if (err) {
                con.release();
                res.send('{"status":"failure"} ', 400);
            } else {
                con.release();
                console.log(result.insertId);
                res.send('{"status":"success"} ', 200);
            }
        }
    );
}

module.exports.getLikesOfPost = async function (con, req, res) {  //get likes of posts
    // Get input from body
    var postId = req.query.postid;

    // Query the database
    con.query(
        `select l.*,u.* from likes l join Post p on p.idPost=l.post_id 
        join Users u on l.user_id=u.idUser
        where l.post_id=${postId} and l.like=1`,

        function (err, result, fields) {
            con.release();
            if (err) {
                res.send('{"error":"like error."} ', 400); // If it sends an error, this line will be sent
            } else {
                res.send(JSON.stringify(result), 200);
            }
        }
    );
}


module.exports.getProfileDetails = async function (con, req, res) {  //get likes of posts
    // Get input from body

    var user_id = req.params.user_id;

    // Query the database
    await con.query(
        `SELECT
        (SELECT COUNT(*)  FROM Post p WHERE p.idUser=${user_id}) as postCount, 
        (SELECT COUNT(*) FROM follow f WHERE f.from_follow=${user_id} and is_follow=1) as followingCount,
        (SELECT COUNT(*) FROM follow f WHERE f.to_follow=${user_id} and is_follow=1) as followerCount ,
        
        u.* from Users u where u.idUser=${user_id} `,
        // `select u.*,count(p.idPost) as postCount,count(f.id) as FollowingCount,count(ff.id) as FollowerCount from Users u 
        //  left join follow f on f.from_follow=u.idUser
        //  left join follow ff on ff.to_follow=u.idUser
        //  left join Post p on p.idUser=u.idUser
        // where u.idUser=${user_id} and f.is_follow=1 and ff.is_follow=1`,

        async function (err, result, fields) {
            con.release();
            if (err) {


                res.send('{"error":"like error."} ', 400); // If it sends an error, this line will be sent
            } else {
                posts = [];
                await con.query(`select * from Post where idUser=${user_id}`, function (err, rest, fields) {

                    //    for (let index = 0; index < rest.length; index++) {
                    //     posts.push(rest[index]);
                    //     console.log(result.posts.length);
                    //       if(index+1==rest.length)
                    //       {
                    //           res.send(JSON.stringify(r), 200);

                    //       }
                    //   }
                    posts.push({ 'UserDetails': result })
                    posts.push({ 'myFeeds': rest })
                    res.send(JSON.stringify(posts), 200);

                })
            }
        }
    );
}

module.exports.FollowUser = async function (con, req, res) {  //unlike
    // Get input from body
    let from_follow = req.query.from_follow;
    let to_follow = req.query.to_follow;
    con.query(`select count(*) as count from follow where from_follow=${from_follow} and to_follow=${to_follow} and is_follow=1`,
        function (err, result, fields) {
            if(err)
            {
                res.send('{"error":" follow error occured."} ', 400); // If it sends an error, this line will be sent

            }
             
            if (result[0].count == 0) {
                con.query(`insert into follow(from_follow,to_follow) values(${from_follow},${to_follow})`,
                    function (err, result1, fields) {
                        if(err)
                        {
                          res.send('{"error":" follow error occured."} ', 400); // If it sends an error, this line will be sent

                        }
                        res.send(JSON.stringify(result1), 200);

                    })
            }
            else
            {
              
                res.send('{"error":" Already following"} ', 400); // If it sends an error, this line will be sent

            }
        }

    )

}

module.exports.UnfollowUser = async function (con, req, res) {  //unlike
    // Get input from body
    let from_unfollow = req.query.from_unfollow;
    let to_unfollow = req.query.to_unfollow;
    con.query(`select count(*) as count from follow where from_follow=${from_unfollow} and to_follow=${to_unfollow} and is_follow=1`,
        function (err, result, fields) {
            if(err)
            {
                res.send('{"error":" unfollow error occured."} ', 400); // If it sends an error, this line will be sent

            }
             
            if (result[0].count >0) {
                con.query(`update follow set is_follow=0 where from_follow=${from_unfollow} and to_follow=${to_unfollow} and is_follow=1`,
                    function (err, result1, fields) {
                        if(err)
                        {
                          res.send('{"error":" unfollow error occured."} ', 400); // If it sends an error, this line will be sent

                        }
                        res.send(JSON.stringify(result1), 200);

                    })
            }
            else
            {
                con.query(`select count(*) as count from follow where from_follow=${from_unfollow} and to_follow=${to_unfollow} and is_follow=0`,
                function (err, result, fields) {
                    console.log(result);
                    if (result[0].count >0) {
                    res.send('{"error":" already unfollowing."} ', 400); // If it sends an error, this line will be sent
                    }
                    else
                    {
                    res.send('{"error":" error occures! you are not  following the user for unfollow."} ', 400); // If it sends an error, this line will be sent

                    }
                })


            }
           
        }

    )

}

module.exports.updateProfile = async function (con, req, res) {  //unlike
    // Get input from body
    let bio = req.query.bio||"";
    let profile_pic = req.query.profile_pic||"";
    let username=req.query.username||"";
    let email=req.query.email||"";
    let user_id=req.query.user_id;


    con.query(`update Users u set u.bio="${bio}",u.profile_pic="${profile_pic}",u.nameUser="${username}",u.emailUser="${email}" where u.idUser=${user_id}`,
        function (err, result, fields) {
            if(err)
            {
                res.send('{"error":"  error occured."} ', 400); // If it sends an error, this line will be sent

            }
             
            if(!result.affectedRows)
            {
                res.send('{"error":"  userId Not Exist."} ', 400); // If it sends an error, this line will be sent

            }
            res.send(JSON.stringify(result), 200);
           
        }

    )

}