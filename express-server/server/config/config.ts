const config: any = {
  development: {
    db: 'mongodb://username:password@mongo-db/qwicki', // MongoDB URL from the docker-compose file
    secret: '5kDF5ZH2W6fWFH2CaIHlByEqkqEQhnM7',
  },
  production: {
    db: process.env.MONGO_DB_ENDPOINT,
    secret: process.env.SECRET,
  },
};
export default config;

// 'mongodb://' + process.env.MONGO_DB_USERNAME + ':' + process.env.MONGO_DB_PASSWORD + '@' + process.env.MONGO_DB_SERVICE + '/' + process.env.MONGO_DB_NAME
