(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('splashPaymentService', splashPaymentService);

    splashPaymentService.$inject = ['request', 'conf'];

    function splashPaymentService(request, conf) {
        var service = {
            getMerchants: getMerchants,
            getMerchant: getMerchant,
            createAuthTxn: createAuthTxn
        };

        return service;

        function getMerchants() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'splashpayment/getmerchants',
                //url: 'https://test-api.splashpayments.com/members',
                method: 'GET',
                params: {}
            });
        }

        function getMerchant(id) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'splashpayment/getmerchant/'+id,
                //url: 'https://test-api.splashpayments.com/members',
                method: 'GET',
                params: {}
            });
        }

        function createAuthTxn(txnData) {
            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'splashpayment/authtxn',
                method: 'POST',
                params: txnData
            });
        }
    }
})();