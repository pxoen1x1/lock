module.exports.routes = {
    'GET /api/users': {
        controller: 'UsersController',
        action: 'getUsers'
    },
    'POST /api/users': {
        controller: 'UsersController',
        action: 'createUser'
    }
};
