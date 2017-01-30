(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('routingService', routingService);

    routingService.$inject = ['$state', 'authService', 'currentUserService', 'coreConstants'];

    /* @ngInject */
    function routingService($state, authService, currentUserService, coreConstants) {
        var service = {
            redirectIfLoggedIn: redirectIfLoggedIn
        };

        return service;

        function redirectIfLoggedIn() {
            if (authService.isAuthenticated()) {

                return currentUserService.getType()
                    .then(function (userType) {
                        $state.go(coreConstants.USER_TYPE_DEFAULT_STATE[userType]);
                    });
            }
        }
    }
})();