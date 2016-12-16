(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('splashPaymentService', splashPaymentService);

    splashPaymentService.$inject = ['request', 'conf'];

    function splashPaymentService(request, conf) {
        var service = {
        };

        return service;



    }
})();