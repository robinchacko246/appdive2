const {ApplyHash_Long, CompareHash_Long} = require("../Security")

// get login credentials
//TODO: do we need this?
// This is just here incase we ever need to get all of the information aboout a user. I will leave the TODO
module.exports.GetLoginInfo = async function (con, req, res) {
    // Get input from body
    var userid = req.query.userid;
    // Query the database
    con.query("SELECT * FROM Users WHERE Users.idUser = " + userid, function(
        err,
        result,
        fields
    ) {
        con.release();
        if (err) {
            res.send('{"error":"login return no equal to one."} ', 400);
        }

        if (result.length == 1) {
            res.send(JSON.stringify(result), 200);
        }
    });
}

/**
 * Get user login information based on username and password
 *
 * String username:
 * String password:
 *
 * @returns  [{"idUser":4,"nameUser":"a","passwordUser":"a","emailUser":"@","incrementUser":9}]
 */
module.exports.Login = async function (con, req, res) {
    // get input from body
    var username = req.query.username;
    var password = req.query.password;
    // Query the database
    console.log("test");
    console.log(req.query);
    console.log(username);
    console.log(password);

    con.query(
        "SELECT * FROM Users WHERE Users.nameUser = '" + username + "';",
        async function(err, result, fields) {
            con.release();
            console.log("Result: " + JSON.stringify(result));

            if (err) {
                // Error
                res.send('{"error":"login return no equal to one."} ', 400);
            } else if (result.length == 0) {
                // Bad Username
                res.send('{"error":"no login result."} ', 400);
            } else if (await (CompareHash_Long(password, result[0].passwordUser))) {
                // Successful Login
                res.send(JSON.stringify(result), 200);
            } else {
                // Bad Password
                res.send('{"error":"no login result."} ', 400);
            }
        }
    );
}

/**
 * get for registering a user and getting back their userId
 *
 * String username:
 * String password:
 * String email:
 *
 * @returns [{"idUser":54}]
 *
 */
module.exports.GetRegister = async function (con, req, res) {
    // get input from body
    var username = req.query.username;
    var password = req.query.password;
    var email = req.query.email;
    var increment = 1;

    // Hash password 
    const hashedPassword = await ApplyHash_Long(password);

    // Query the datbase
    console.log("Helloworld");
    con.query(
        "INSERT INTO Users (nameUser, passwordUser, emailUser, incrementUser) " +
        "VALUES ( '" +
        username +
        "', '" +
        hashedPassword +
        "', '" +
        email +
        "', " +
        increment +
        ");",
        function(err, result, fields) {
            con.release();
            if (err) {
                res.send('{"error":"register is duplicate or failed."} ', 400);
            } else {
                con.query(
                    "SELECT Users.idUser FROM Users WHERE Users.nameUser = '" +
                    username +
                    "';",
                    function(err, result, fields) {
                        if (err) {
                            res.send('{"error":"register is duplicate or failed."} ', 400);
                        } else {
                            res.send(JSON.stringify(result), 200);
                        }
                    }
                );
            }
        }
    );
}