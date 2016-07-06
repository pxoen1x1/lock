module.exports.routes = {
    'POST /api/client': {
        controller: 'CustomerController',
        action: 'createCustomer'
    },
    'PUT /api/client/:id': {
        controller: 'CustomerController',
        action: 'updateCustomer'
    }
};
