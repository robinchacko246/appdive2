
const util = require('util');




module.exports.saveMessage = async function (from_user_id,to_user_id,room,msg,pool) {  //get likes of posts
    try {
       
        console.log("insde save message");
        let data=[];
        data.push(msg);

        data.push(from_user_id);
        data.push(to_user_id)
        data.push(room)
        console.log("data is==========================>",data);

        var result = await pool.query({
          sql: "INSERT INTO messages (message, from_user_id, to_user_id,room) VALUES (?)",
          values: [data]
        });
        return result.affectedRows;
      } catch (err) {
        throw new Error(err);
      }
}

module.exports.getMessages = async function (con, req, res) {  //get messages 
    var sender = req.query.sender;
    var reciever=req.query.reciever;



    //
    //var postId = req.query.postid;
  
    
    con.query(
        `Select DISTINCT m1.* from messages m1
        join messages m2 
        
        where (m1.from_user_id=${sender} and m1.to_user_id=${reciever}) OR (m1.to_user_id=${sender} and m1.from_user_id=${reciever}) order by m1.id DESC`,
        
        function(err, result, fields) {
            con.release();
            if (err) {
                res.send('{"error":"message fetch error."} ', 400); // If it sends an error, this line will be sent
            } else {
                res.send(JSON.stringify(result), 200);
            }
        }
    );
}
//SELECT * FROM divernowapp.messages m where from_user_id=50 order by created_at des;

module.exports.allMessages = async function (con, req, res) {  //get messages 
    var user_id = req.params.user_id;






    con.query(

       
        `SELECT (select count(m1.id)  from messages m1 where (m1.from_user_id =${user_id} or m1.to_user_id=${user_id}) and m1.read=0 group by m.room) as notReadCount, 
        m.*  FROM messages m 
        
        left join Users u on u.idUser=m.to_user_id
        
        where   
        m.id in ( SELECT max(id) FROM messages where from_user_id=${user_id} or to_user_id=${user_id} group by room) 
        group by room order by id desc;`, 
        
        
        function(err, result, fields) {

            con.release();
            if (err) {
                res.send('{"error":"message fetch error."} ', 400); // If it sends an error, this line will be sent
            } else {
                  
               
                res.send(JSON.stringify(result), 200);

            }
        }
    );
}

//update read status
module.exports.updateReadStatus = async function (con, req, res) {  //get likes of posts
    // Get input from body
    var sender = req.query.sender;
    var reciever=req.query.reciever;

    con.query(`select count(r.id) as count,room from rooms r where (user1=${sender} or user2=${sender}) and  (user1=${reciever} or user2=${reciever})`,function(err,result)
    {
        console.log("room::",result[0].room);
           // Query the database
    con.query(
        `Update messages m set m.read=1 where m.room="${result[0].room}"`,
        
        function(err, result, fields) {
            con.release();
            if (err) {
                res.send('{"error":"update read status error."} ', 400); // If it sends an error, this line will be sent
            } else {
                res.send(JSON.stringify(result), 200);
            }
        }
    );
    })
 
}

module.exports.updateOnlineStatus=async (user_id,pool,status)=>
{
    try {
        console.log("inside status change controller",user_id);
       

        
        var result = await pool.query(`Update Users u set u.active=${status} where idUser=${user_id}`);
        return result.affectedRows;
      } catch (err) {
        throw new Error(err);
      }
}

module.exports.getOnlineUsers = async function (con, req, res) {  //get messages 
    




  
  
    
    con.query(
        `SELECT * FROM Users where active=1`,
        
        function(err, result, fields) {
            con.release();
            if (err) {
                res.send('{"error":"users fetch error."} ', 400); // If it sends an error, this line will be sent
            } else {
                res.send(JSON.stringify(result), 200);
            }
        }
    );
}

module.exports.saveRoom=async(u1,u2,pool)=>
{
pool.query = util.promisify(pool.query);

var r = (Math.random() + 1).toString(36).substring(7);

 var result =  await pool.query(`Select count(r.id) as count,room from rooms r where (user1=${u1} or user2=${u1}) and  (user1=${u2} or user2=${u2})`);


if(result[0].count==0)
{

var result = await pool.query(`Insert into  rooms (user1,user2,room) values (${u1},${u2},"${r}")`);
return r;
}
else
{
    return result[0].room;
}



}


module.exports.getUserNames = async function (from_user_id, pool) {  //get likes of posts
    try {
        pool.query = util.promisify(pool.query);
        var result = await pool.query(`SELECT * FROM Users WHERE idUser=${from_user_id}`);
        return result;
      } catch (err) {
        throw new Error(err);
      }
}
