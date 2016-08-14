(function () {
    'use strict';

    angular
        .module('app.customer')
        .factory('customerDataservice', customerDataservice);

    customerDataservice.$inject = ['$http', 'conf'];

    /* @ngInject */
    function customerDataservice($http, conf) {
        var service = {
            createRequest: createRequest
        };

        return service;

        function createRequest(newRequest) {

            return $http({
                url: conf.URL + 'request',
                method: 'POST',
                data: newRequest,
                withCredentials: true
            })
                .then(createRequestCompleted);

            function createRequestCompleted(response) {

                return response.data;
            }

        }
    }
})();