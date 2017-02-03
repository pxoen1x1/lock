(function () {
    'use strict';

    angular
        .module('app.login')
        .config(configureState);

    configureState.$inject = ['$stateProvider'];

    /* @ngInject */
    function configureState($stateProvider) {
        $stateProvider
            .state('login', {
                parent: 'root',
                url: '/login',
                views: {
                    'content@root': {
                        templateUrl: 'login/layout/layout.html'
                    },
                    'header@login': {
                        templateUrl: 'login/layout/header/header.html'
                    },
                    'content@login': {
                        templateUrl: 'login/login.html',
                        controller: 'LoginController',
                        controllerAs: 'vm'
                    }
                }
            });
    }
})();