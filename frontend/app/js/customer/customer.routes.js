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
                        templateUrl: 'customer/layout/menu/menu.html',
                        controller: 'CustomerMenuController',
                        controllerAs: 'vm'
                    },
                    'header@customer': {
                        templateUrl: 'customer/layout/header/header.html',
                        controller: 'CustomerHeaderController',
                        controllerAs: 'vm'
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
            .state('customer.request.new', {
                url: '/new',
                views: {
                    'content@customer': {
                        templateUrl: 'customer/new-request/new-request.html',
                        controller: 'NewRequestController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'New request',
                    icon: 'playlist_add'
                }
            })
            .state('customer.request.view', {
                url: '/{requestId:int}',
                views: {
                    'content@customer.request': {
                        templateUrl: 'customer/view-request/view-request.html',
                        controller: 'ViewRequestController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('customer.request.map', {
                url: '/{requestId:int}/map',
                views: {
                    'content@customer.request': {
                        templateUrl: 'customer/request/map/map.html',
                        controller: 'CustomerRequestMapController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('customer.request.chat', {
                url: '/{requestId:int}/chat',
                views: {
                    'content@customer.request': {
                        templateUrl: 'customer/request/chat/chat.html',
                        controller: 'CustomerRequestChatController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('customer.request.recommended', {
                url: '/{requestId:int}/recommended',
                views: {
                    'content@customer.request': {
                        templateUrl: 'customer/request/recommended/recommended.html',
                        controller: 'CustomerRequestRecommendedController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('customer.settings', {
                url: '/settings',
                data: {
                    title: 'Settings',
                    icon: 'settings'
                }
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
                },
                data: {
                    title: 'History',
                    icon: 'history'
                }
            });
    }
})();