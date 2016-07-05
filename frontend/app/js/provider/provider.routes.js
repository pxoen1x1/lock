(function () {
    'use strict';

    angular
        .module('app.provider')
        .config(configureState);
    
    configureState.$inject = ['$stateProvider'];

    /* @ngInject */
    function configureState($stateProvider) {
        $stateProvider
            .state('provider', {
                parent: 'root',
                abstract: true,
                url: '/provider',
                views: {
                    'content@root': {
                        templateUrl: 'provider/layout/layout.html'
                    }
                }
            })
            .state('provider.registration', {
                url: '/registration',
                views: {
                    'content@provider': {
                        templateUrl: 'provider/registration/registration.html',
                        controller: 'ProviderRegistrationController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('provider.content', {
                abstract: true,
                views: {
                    'menu@provider': {
                        templateUrl: 'provider/layout/menu.html'
                    },
                    'header@provider': {
                        templateUrl: 'provider/layout/header.html'
                    }
                }
            })
            .state('provider.content.requests', {
                url: '/requests',
                views: {
                    'content@provider': {
                        templateUrl: 'provider/requests/requests.html',
                        controller: 'providerRequestsController',
                        controllerAs: 'vm'
                    }
                }
            });
    }
})();