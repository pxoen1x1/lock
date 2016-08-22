(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerViewRequestController', CustomerViewRequestController);

    CustomerViewRequestController.$inject = ['$stateParams', 'coreDataservice'];

    /* @ngInject */
    function CustomerViewRequestController($stateParams, coreDataservice) {
        var promises = {
            getRequest: null
        };

        var vm = this;

        vm.request = {};

        vm.selectedRequestId = $stateParams.requestId;

        activate();

        function getRequestById(requestId) {
            if (promises.getRequest) {
                promises.getRequest.cancel();
            }

            promises.getRequest = coreDataservice.getRequest(requestId);

            return promises.getRequest
                .then(function (response) {

                    return response.data.request;
                });
        }

        function getRequest() {
            var selectedRequestId = {
                id: vm.selectedRequestId
            };

            getRequestById(selectedRequestId)
                .then(function (request) {
                    vm.request = request;

                    return vm.request;
                });
        }

        function activate() {
            getRequest();
        }
    }
})();