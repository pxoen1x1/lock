module.exports.routes = {
    'POST /api/login': {
        controller: 'AuthController',
        action: 'login'
    },

    'POST /api/logout': {
        controller: 'AuthController',
        action: 'logout'
    } 
};