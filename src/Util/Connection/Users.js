/**
 * Block a user
 *
 * int userid: your userid
 * ind blockedidUser: the id of the user you want to block
 */
module.exports.GetBlock = async function (con, req, res) {
    // get input from body
    var userid = req.query.userid;
    var blockedidUser = req.query.blockedidUser;
    // query the database
    con.query(
        "INSERT INTO BlockedUser (blockedidUser, blockedidBlockUser) " +
        "VALUES ( " +
        userid +
        ", " +
        blockedidUser +
        ");",
        function(err, result, fields) {
            con.release();
            if (err) {
                res.send('{"status":"failure"} ', 400);
            } else {
                //if (result[0].affectedRows == 1) { //TODO this breaks the server but the block goes through, maybe take this out?
                res.send('{"status":"success"} ', 200); //TODO this reminds me that you should put everything in a try catch so the server never crashes under any condition
                //    } else {
                //        res.send("{\"status\":\"failure\"} ", 400);
                //    }
            }
        }
    );
}