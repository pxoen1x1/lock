(function () {
    'use strict';

    angular
        .module('app.customer')
        .config(configureState);

    configureState.$inject = ['$stateProvider'];

    /* @ngInject */
    function configureState($stateProvider) {
        $stateProvider
            .state('customer', {
                parent: 'root',
                //abstract: true,
                url: '/client',
                views: {
                    'content@root': {
                        templateUrl: 'customer/layout/layout.html',
                        controller: 'CustomerLayoutController',
                        controllerAs: 'vm'
                    },
                    'content@customer': {
                        templateUrl: 'customer/layout/content.html'
                    },
                    'menu@customer': {
                        templateUrl: 'customer/layout/menu.html'
                    },
                    'header@customer': {
                        templateUrl: 'customer/layout/header.html'
                    }
                }
            })
            .state('customer.registration', {
                url: '/registration',
                views: {
                    'content@root': {
                        templateUrl: 'customer/layout/registration-layout.html'
                    },
                    'content@customer.registration': {
                        templateUrl: 'customer/registration/registration.html',
                        controller: 'CustomerRegistrationController',
                        controllerAs: 'vm'
                    },
                    'header@customer.registration': {
                        templateUrl: 'customer/layout/registration-header.html'
                    }
                }
            })
            .state('customer.request', {
                url: '/request',
                views: {
                    'content@customer': {
                        templateUrl: 'customer/request/request.html',
                        controller: 'CustomerRequestController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('customer.map', {
                url: '/map'
            })
            .state('customer.chat', {
                url: '/chat'
            })
            .state('customer.recommended', {
                url: '/recommended'
            })
            .state('customer.settings', {
                url: '/settings'
            })
            .state('customer.profile', {
                url: '/profile',
                views: {
                    'content@customer': {
                        templateUrl: 'customer/profile/profile.html',
                        controller: 'CustomerProfileController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('customer.history', {
                url: '/history',
                views: {
                    'content@customer': {
                        templateUrl: 'customer/history/history.html',
                        controller: 'CustomerHistoryController',
                        controllerAs: 'vm'
                    }
                }
            });
    }
})();