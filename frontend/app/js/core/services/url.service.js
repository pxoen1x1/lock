(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('urlService', urlService);

    urlService.$inject = ['$location'];

    /* @ngInject */
    function urlService($location) {
        var service = {
            getUrl: getUrl
        };

        return service;

        function getUrl() {
            var url = '';

            var protocol = $location.protocol();
            var host = $location.host();
            var port = $location.port();

            url = protocol + '://' + host;
            url += port ? ':' + port : '';

            return url;
        }
    }
})();