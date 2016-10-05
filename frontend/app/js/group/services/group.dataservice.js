(function () {
    'use strict';

    angular
        .module('app.group')
        .factory('groupDataservice', groupDataservice);

    groupDataservice.$inject = ['$http', 'request', 'conf'];

    /* @ngInject */
    function groupDataservice($http, request, conf) {
        var service = {};

        return service;
    }
})();