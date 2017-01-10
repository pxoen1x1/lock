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
                    },
                    'menu@root': {
                        templateUrl: 'layout/menu.html'
                    },
                    'header@root': {
                        templateUrl: 'layout/header.html'
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
                },
                data: {
                    isPublic: true
                }
            })
            .state('users', {
                parent: 'root',
                url: '/users',
                views: {
                    'content@root': {
                        templateUrl: 'users/users.html',
                        controller: 'UsersController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Users',
                    menuItem: {
                        icon: 'people'
                    }
                }
            });

        $urlRouterProvider.otherwise('/users');
    }
})();