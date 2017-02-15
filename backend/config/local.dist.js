module.exports = {
    connections: {
        developmentMysqlServer: {
            adapter: 'sails-mysql',
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'lockheal',
            charset: 'utf8',
            collation: 'utf8_general_ci'
        }
    },

    session: {
        host: 'localhost'
    },

    orm: {
        _hookTimeout: 120000
    },

    baseUrl: 'http://192.168.0.121:1337',
    homePage: 'http://localhost:9000',
    splashpaymentParams: {
        host : 'test-api.splashpayments.com',
        apikey: '33629206d38422c644df7e0d9d7838b0',
        merchantsGroupId: 'g1583ed145ba606'
    }
};
