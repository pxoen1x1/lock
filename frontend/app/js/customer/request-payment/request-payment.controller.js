(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestPaymentController', CustomerRequestPaymentController);

    CustomerRequestPaymentController.$inject = ['currentUserService'];

    /* @ngInject */
    function CustomerRequestPaymentController(currentUserService, request) {

        var vm = this;
        vm.txnData = {};
        vm.createAuthTxn = createAuthTxn;



        function createAuthTxn(txnData, isFormValid) {
            if (!isFormValid) {

                return;
            }
            return currentUserService.createAuthTxn(txnData);

        }

    }
})();