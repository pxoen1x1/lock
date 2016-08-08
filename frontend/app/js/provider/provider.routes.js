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
                url: '/specialist',
                views: {
                    'content@root': {
                        templateUrl: 'provider/layout/layout.html',
                    },
                    'menu@customer': {
                        templateUrl: 'provider/layout/menu.html'
                    },
                    'header@customer': {
                        templateUrl: 'provider/layout/header.html'
                    }
                }
            })
            .state('provider.registration', {
                url: '/registration',
                views: {
                    'content@root': {
                        templateUrl: 'provider/layout/registration-layout.html'
                    },
                    'content@provider.registration': {
                        templateUrl: 'provider/registration/registration.html',
                        controller: 'ProviderRegistrationController',
                        controllerAs: 'vm'
                    },
                    'header@provider.registration': {
                        templateUrl: 'provider/layout/registration-header.html'
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