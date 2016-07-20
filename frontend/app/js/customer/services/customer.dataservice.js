(function () {
    'use strict';

    angular
        .module('app.customer')
        .factory('customerDataservice', customerDataservice);

    customerDataservice.$inject = ['$http', 'conf'];

    /* @ngInject */
    function customerDataservice($http, conf) {
        var service = {
            createCustomer: createCustomer,
            updateCustomer: updateCustomer
        };

        return service;

        function updateCustomer(customer) {

            return $http({
                url: conf.URL + 'user/' + customer.id,
                method: 'PUT',
                data: customer
            })
                .then(updateCustomerComplete);

            function updateCustomerComplete(response) {

                return response.data;
            }
        }
    }
})();