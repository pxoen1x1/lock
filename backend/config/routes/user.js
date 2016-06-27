module.exports.routes = {
    'GET /api/user': {
        controller: 'UserController',
        action: 'getUsers'
    },
    'POST /api/users': {
        controller: 'UserController',
        action: 'createUser'
    }
};
