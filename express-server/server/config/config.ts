const config: any = {
    development: {
        db: 'mongodb://database/mean' // MongoDB URL from the docker-compose file
    },
    production: {
        db: process.env.MONGO_DB_ENDPOINT
    }
};
export default config;