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
            })
            .state('home.commission', {
                url: '/commission',
                views: {
                    'content@home': {
                        templateUrl: 'layout/legal/commission-content.html'
                    }
                }
            })
            .state('home.copyright', {
                url: '/copyright',
                views: {
                    'content@home': {
                        templateUrl: 'layout/legal/copyright-content.html'
                    }
                }
            })
            .state('home.privacy', {
                url: '/privacy',
                views: {
                    'content@home': {
                        templateUrl: 'layout/legal/privacy-content.html'
                    }
                }
            })
            .state('home.terms', {
                url: '/terms',
                views: {
                    'content@home': {
                        templateUrl: 'layout/legal/terms-content.html'
                    }
                }
            });
    }
})();