// This script will run on 'test' db by default or the db specified by the ENV var MONGO_INITDB_DATABASE 
// We have specified MONGO_INITDB_DATABASE=qwicki

// Create a new user with readWrite privilege that will be attached to 'qwicki' db
db.createUser({
  user: 'username',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'qwicki',
    }
  ],
});

// Insert a document into the users collection
db.users.insert({username: 'admin', usernameRaw: 'admin', password: 'password'});