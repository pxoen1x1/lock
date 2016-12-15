(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestPaymentController', CustomerRequestPaymentController);

    CustomerRequestPaymentController.$inject = ['splashPaymentService'];

    /* @ngInject */
    function CustomerRequestPaymentController(splashPaymentService, request) {

        var vm = this;
        vm.txnData = {};
        vm.createAuthTxn = createAuthTxn;



        function createAuthTxn(txnData, isFormValid) {
            alert('asdasds');
            if (!isFormValid) {

                return;
            }
            return splashPaymentService.createAuthTxn(txnData);

        }

    }
})();