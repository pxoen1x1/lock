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
                        templateUrl: 'customer/registration/layout/layout.html'
                    },
                    'content@customer.registration': {
                        templateUrl: 'customer/registration/layout/content.html',
                        controller: 'CustomerRegistrationController',
                        controllerAs: 'vm'
                    },
                    'header@customer.registration': {
                        templateUrl: 'customer/registration/layout/header.html'
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
            });
    }
})();