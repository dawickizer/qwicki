// This script will run on 'test' db by default or the db specified by the ENV var MONGO_INITDB_DATABASE 
// We have specified MONGO_INITDB_DATABASE=mean

// Create a new user with readWrite privilege that will be attached to 'mean' db
db.createUser({
  user: 'username',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'mean',
    }
  ],
});

// Insert a document into the users collection
db.users.insert({name: 'David', age: 45});