const config = {
    development: {
        db: 'mongodb://database/mean' // MongoDB URL from the docker-compose file
    },
    production: {
        db: ''
    }
};
module.exports = config;