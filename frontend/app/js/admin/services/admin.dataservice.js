(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('adminDataservice', adminDataservice);

    adminDataservice.$inject = ['request', 'conf'];

    /* @ngInject */
    function adminDataservice(request, conf) {
        var service = {
            getUsers: getUsers
        };

        return service;

        function getUsers(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'admin/users',
                method: 'GET',
                params: params
            });
        }
    }
})();