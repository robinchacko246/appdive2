# DiverNow-Backend
## Basic Usage

##### making calls
To interact with the API, we use the address `http://ec2-54-91-94-178.compute-1.amazonaws.com:3000/` followed by a function name and its perametered in the following format:
```
http://ec2-54-91-94-178.compute-1.amazonaws.com:3000/<function-name>?<arg1>=<val1>&<arg2>=<val2>&...
```
After the API address, we put the name of the function (endpoint) we are calling to. If we need to put in arguments as well, after the function name, put a `?` followed by the argument name and value of the argument in the format, `<argName>=<value>`. We can put as many parameters as necessary, with each seperated by a `&`.

##### return value
The return value, if there is one, will be a JSON object in a format specified for the called function.

## Types
these are the commonly used types through out the app as parameters or in the return types from the API functions
### User
```
{
  userID    : Int
  userName  : String
  password  : String
}
```
***

### Post
```
{
  userName  : String
  imageURL  : String
  title     : String
  caption   : string
}
```

## Functions

### getLoginInfo
##### parameters
 - `userid : Int`
##### return JSON
```
{
  user: User
}
```
##### description
returns the user data of a user with the given user ID
##### example
```
http://ec2-54-91-94-178.compute-1.amazonaws.com:3000/
  getLoginInfo?userid=123
```
***

### getPost
##### parameters
 - `userid     : Int`
 - `recenttime : SQL DateTime`
##### return JSON
```
[{"idPost":1,
"titlePost":"Jack in c minor",
"descriptionPost":"Be rootin, be tootin, and by god be shootin, but most of all, be kind",
"longitudePost":-73,
"latitudePost":45,
"timePost":"2019-06-07T01:14:33.000Z",
"idUser":1,
"picturePost":"https://divernowapp.s3.us-east-2.amazonaws.com/jack.jpg"},

{"idPost":17,
"titlePost":"first
real post",
"descriptionPost":"here weeeeee goooooooooo",
"longitudePost":-73.2887308,
"latitudePost":40.6894906,
"timePost":"2019-07-16T01:07:45.000Z",
"idUser":4,
"picturePost":"https://divernowapp.s3.us-east-2.amazonaws.com/4-1.jpg"}]
```
##### description
returns an array of posts for a given user after the given time stamp. The time stamp given should be the time at which a users posts were last recieved so that we only grab the new posts that we have not yet grabbed. To grab all posts, use `recenttime = 0`.
##### example
```
http://ec2-54-91-94-178.compute-1.amazonaws.com:3000/
  getPost?userid=123&recenttime=2004-05-23T14:25:10
```

***

### getUserPosts
##### parameters
 - `userpostid     : Int`
##### return JSON
```
[{"idPost":1,
"titlePost":"Jack in c minor",
"descriptionPost":"Be rootin, be tootin, and by god be shootin, but most of all, be kind",
"longitudePost":-73,
"latitudePost":45,
"timePost":"2019-06-07T01:14:33.000Z",
"idUser":1,
"picturePost":"https://divernowapp.s3.us-east-2.amazonaws.com/jack.jpg"},
... 
(array of posts but only one is shown here)
```
##### description
returns an array of posts from a specific user.  userpostid is the userid of the user that you want to see posts from.  This will give you all of the information about each post.
##### example
```
http://ec2-54-91-94-178.compute-1.amazonaws.com:3000/
  getUserPosts?userid=123
```
***

### login
##### parameters
 - `username : string`
 - `password : string`
##### return JSON
```
[{"idUser":4,
"nameUser":"a",
"passwordUser":"a",
"emailUser":"@",
"incrementUser":1}]
```
##### description
returns an array of the user information.  After loginning in you are returned this information.
##### example
```
http://ec2-54-91-94-178.compute-1.amazonaws.com:3000/login?username=a&password=a
```
***

### getRegister
##### parameters
 - `username : string`
 - `password : string`
 - `email    : string`
##### return JSON
```
[{"idUser":16}]
```
##### description
returns the idUser of a new user who just registered.
##### example
```
http://ec2-54-91-94-178.compute-1.amazonaws.com:3000/getRegister?username=e&password=e&email=e
```
***

### getBlock
##### parameters
 - `userid : Int`
 - `blockedidUser : Int`
##### return JSON
```
{"fieldCount":0,
"affectedRows":1,
"insertId":7,
"serverStatus":2,
"warningCount":0,
"message":"",
"protocol41":true,
"changedRows":0}
```
##### description
adds you and the blocked user to the Blocked table by making a new row where the user ids are stored.
##### example
```
http://ec2-54-91-94-178.compute-1.amazonaws.com:3000/getBlock?userid=1&blockedidUser=9
```
***

### getIncrement
##### parameters
 - `userid : Int`
##### return JSON
```
{"fieldCount":0,
"affectedRows":1,
"insertId":0,
"serverStatus":2,
"warningCount":0,
"message":"(Rows matched: 1 Changed: 1, Warnings: 0","protocol41":true,"changedRows":1}
```
##### description
increments the user's incrementor by their idUser.  Used to take the incrementor and plug it into the add post and the s3 bucket for storing pics.
##### example
```
http://ec2-54-91-94-178.compute-1.amazonaws.com:3000/getIncrement?userid=1
```
***

### getAddPost
##### parameters
 - `title : string`
 - `description : string`
 - `currentLongitude : double`
 - `currentLatitude : double`
 - `pictureAddress  : string`
 - `userid : Int`
##### return JSON
```
{"fieldCount":0,
"affectedRows":1,
"insertId":18,
"serverStatus":2,
"warningCount":0,
"message":"",
"protocol41":true,
"changedRows":0}
```
##### description
adds a new post to the Post table in the database.
##### example
```
http://ec2-54-91-94-178.compute-1.amazonaws.com:3000/getAddPost?title=titletest&description=descriptest&currentLongitude=50&currentLatitude=73&pictureAddress=pictest&userid=1
```

# appdive2
