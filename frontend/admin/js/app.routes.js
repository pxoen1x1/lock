(function () {
    'use strict';

    angular
        .module('app')
        .config(configureState);

    configureState.$inject = ['$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function configureState($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('root', {
                url: '',
                abstract: true,
                views: {
                    '@': {
                        templateUrl: 'layout/layout.html'
                    }
                }
            })
            .state('login', {
                url: '/login',
                views: {
                    '@': {
                        templateUrl: 'login/login.html',
                        controller: 'LoginController',
                        controllerAs: 'vm'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');
    }
})();