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
                //abstract: true,
                url: '/provider',
                views: {
                    'content@root': {
                        templateUrl: 'provider/layout/layout.html'
                    },
                    'menu@provider': {
                        templateUrl: 'provider/layout/menu.html'
                    },
                    'header@provider': {
                        templateUrl: 'provider/layout/header.html'
                    }
                }
            })
            .state('provider.registration', {
                url: '/registration',
                views: {
                    'content@root': {
                        templateUrl: 'provider/registration/layout/layout.html'
                    },
                    'content@provider.registration': {
                        templateUrl: 'provider/registration/layout/content.html',
                        controller: 'ProviderRegistrationController',
                        controllerAs: 'vm'
                    },
                    'header@provider.registration': {
                        templateUrl: 'provider/registration/layout/header.html'
                    }
                }
            })
            .state('provider.requests', {
                url: '/requests',
                views: {
                    'content@root': {
                        templateUrl: 'provider/requests/requests.html',
                        controller: 'providerRequestsController',
                        controllerAs: 'vm'
                    }
                }
            });
    }
})();