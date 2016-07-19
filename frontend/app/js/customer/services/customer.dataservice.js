(function () {
    'use strict';

    angular
        .module('app.customer')
        .factory('customerDataservice', customerDataservice);

    customerDataservice.$inject = ['$http'];

    /* @ngInject */
    function customerDataservice($http) {
        var service = {
            createCustomer: createCustomer,
            updateCustomer: updateCustomer
        };

        return service;

        function createCustomer(customer) {

            return $http({
                url: '/api/client',
                method: 'POST',
                data: customer
            })
                .then(createCustomerComplete);

            function createCustomerComplete(response) {

                return response.data;
            }
        }

        function updateCustomer(customer) {

            return $http({
                url: '/api/client/' + customer.id,
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