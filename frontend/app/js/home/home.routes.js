(function () {
    'use strict';

    angular
        .module('app.home')
        .config(configureState);

    configureState.$inject = ['$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function configureState($stateProvider) {
        $stateProvider
            .state('home', {
                parent: 'root',
                abstract: true,
                views: {
                    'content@root': {
                        templateUrl: 'home/home.html'
                    },
                    'header@home': {
                        templateUrl: 'home/home-header.html'
                    },
                    'footer@home': {
                        templateUrl: 'home/home-footer.html'
                    }
                }
            })
            .state('home.main', {
                url: '/',
                views: {
                    'content@home': {
                        templateUrl: 'home/home-content.html',
                        controller: 'HomeController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('home.how', {
                url: '/how-it-works',
                views: {
                    'content@home': {
                        templateUrl: 'home/how-content.html'
                    }
                }
            })
            .state('home.faq', {
                url: '/faq',
                views: {
                    'content@home': {
                        templateUrl: 'home/faq-content.html'
                    }
                }
            });
    }
})();