const users = [];

// Join user to chat
function userJoin(id, user_id) {
  const user = { id, user_id};

  users.push(user);

  return user;
}

// Get current user
function getUser(id) {
  console.log("users=======================================================================================>",users);
  return users.find(user => user.room === id);
}

// User leaves chat
function userLeave(id) {
  
  const index = users.findIndex(user => user.id === id);
  
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getUser,
  userLeave,
  getRoomUsers
};
