var config = {
    development: {
        server_port: 8000,
        super_prime: 7077667
    },
    production: {
        server_port: 3003,
        super_prime: 7077667
    }
};

module.exports = config['development'];