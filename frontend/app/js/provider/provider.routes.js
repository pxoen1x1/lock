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
                    'menu@provider': {
                        templateUrl: 'provider/layout/menu/menu.html',
                        controller: 'ProviderMenuController',
                        controllerAs: 'vm'
                    },
                    'header@provider': {
                        templateUrl: 'provider/layout/header/header.html',
                        controller: 'ProviderHeaderController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Specialist'
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
                parent: 'provider',
                url: '/requests',
                views: {
                    'content@provider': {
                        templateUrl: 'provider/requests/requests.html',
                        controller: 'ProviderRequestsController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Requests',
                    menu: {
                        icon: 'list',
                        title: 'Requests'
                    }
                }
            })
            .state('provider.profile', {
                parent: 'provider',
                url: '/profile',
                views: {
                    'content@provider': {
                        templateUrl: 'provider/profile/profile.html',
                        controller: 'ProviderProfileController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Profile'
                }
            })
            .state('provider.profile.public', {
                parent: 'provider.profile',
                url: '/{profileId:int}',
                views: {
                    'content@provider': {
                        templateUrl: 'provider/public-profile/public-profile.html',
                        controller: 'ProviderPublicProfileController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Public'
                }
            });
    }
})();