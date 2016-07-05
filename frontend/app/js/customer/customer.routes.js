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
                abstract: true,
                url: '/client',
                views: {
                    'content@root': {
                        templateUrl: 'customer/layout/layout.html'
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
                    'content@customer': {
                        templateUrl: 'customer/registration/registration.html',
                        controller: 'CustomerRegistrationController'
                    }
                }
            })
            .state('customer.requests', {
                url: '/requests',
                views: {
                    'content@customer': {
                        templateUrl: 'customer/requests/requests.html',
                        controller: 'CustomerRequestsController',
                        controllerAs: 'vm'
                    }
                }
            });
    }
})();