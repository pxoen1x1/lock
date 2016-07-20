(function () {
    'use strict';

    angular
        .module('app.customer')
        .factory('customerDataservice', customerDataservice);

    customerDataservice.$inject = ['$http', 'conf'];

    /* @ngInject */
    function customerDataservice($http, conf) {
        var service = {};

        return service;
    }
})();