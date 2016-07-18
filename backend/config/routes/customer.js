module.exports.routes = {
    'GET /client/registration/confirm': {
        controller: 'CustomerController',
        action: 'confirmRegistration'
    },
    'POST /api/client': {
        controller: 'CustomerController',
        action: 'createCustomer'
    },
    'PUT /api/client/:id': {
        controller: 'CustomerController',
        action: 'updateCustomer'
    }
};
