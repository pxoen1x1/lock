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
            .state('home', {
                parent: 'root',
                url: '/',
                views: {
                    'content@root': {
                        templateUrl: 'home/home.html',
                        controller: 'HomeController',
                        controllerAs: 'vm'
                    },
                    'content@home': {
                        templateUrl: 'home/home-content.html',
                        controller: 'HomeController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('how', {
                parent: 'root',
                url: '/how-it-works',
                views: {
                    'content@root': {
                        templateUrl: 'home/home.html',
                        //controller: 'HomeController',
                        //controllerAs: 'vm'
                    },
                    'content@how': {
                        templateUrl: 'home/how-content.html',
                        //controller: 'HomeController',
                        //controllerAs: 'vm'
                    }
                }
            })
            .state('faq', {
                parent: 'root',
                url: '/faq',
                views: {
                    'content@root': {
                        templateUrl: 'home/home.html',
                        //controller: 'HomeController',
                        //controllerAs: 'vm'
                    },
                    'content@faq': {
                        templateUrl: 'home/faq-content.html',
                        //controller: 'HomeController',
                        //controllerAs: 'vm'
                    }
                }
            })
            .state('login', {
                reloadOnSearch: false
            });

        $urlRouterProvider.otherwise( function($injector) {
            var $state = $injector.get('$state');

            $state.go('home');
        });
    }
})();