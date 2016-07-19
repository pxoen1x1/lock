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

        function createCustomer(customer) {

            return $http({
                url: conf.URL + 'client',
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
                url: conf.URL + 'client/' + customer.id,
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