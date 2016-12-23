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
        vm.createTokenAndTxn = createTokenAndTxn;



        function createTokenAndTxn(txnData, isFormValid) {
            if (!isFormValid) {

                return;
            }
            return core.createTokenAndTxn(txnData);

        }

    }
})();