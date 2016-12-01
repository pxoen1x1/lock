(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestPaymentController', CustomerRequestPaymentController);

    CustomerRequestPaymentController.$inject = ['splashPaymentService', 'request'];

    /* @ngInject */
    function CustomerRequestPaymentController(splashPaymentService, request) {

        var vm = this;
        vm.getMerchants = getMerchants;
        vm.getMerchant = getMerchant;
        vm.callBackend = callBackend;


        function getMerchants() {
            return splashPaymentService.getMerchants();
        }

        function getMerchant(id) {
            return splashPaymentService.getMerchant(id);
        }


        function callBackend(state, params) {
            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'lists/languages',
                method: 'GET'
            });
        }

    }
})();