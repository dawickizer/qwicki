const config: any = {
    development: {
        db: 'mongodb://username:password@database/mean' // MongoDB URL from the docker-compose file
    },
    production: {
        db: process.env.MONGO_DB_ENDPOINT
    }
};
export default config;

// 'mongodb://' + process.env.MONGO_DB_USERNAME + ':' + process.env.MONGO_DB_PASSWORD + '@' + process.env.MONGO_DB_SERVICE + '/' + process.env.MONGO_DB_NAME
