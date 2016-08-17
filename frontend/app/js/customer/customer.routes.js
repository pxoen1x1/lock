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
                url: '/request'
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
            .state('customer.request.history', {
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
            })
            .state('customer.request.id', {
                abstract: true,
                url: '/{requestId:int}',
                views: {
                    'content@customer': {
                        templateUrl: 'customer/request/request.html',
                        controller: 'CustomerRequestController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('customer.request.id.view', {
                url: '/view',
                views: {
                    'content@customer.request.id': {
                        templateUrl: 'customer/view-request/view-request.html',
                        controller: 'ViewRequestController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Request',
                    icon: 'list'
                }
            })
            .state('customer.request.id.map', {
                url: '/map',
                views: {
                    'content@customer.request.id': {
                        templateUrl: 'customer/request/map/map.html',
                        controller: 'CustomerRequestMapController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Map',
                    icon: 'location_on'
                }
            })
            .state('customer.request.id.chat', {
                url: '/chat',
                views: {
                    'content@customer.request.id': {
                        templateUrl: 'customer/request/chat/chat.html',
                        controller: 'CustomerRequestChatController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Chat',
                    icon: 'chat'
                }
            })
            .state('customer.request.id.recommended', {
                url: '/recommended',
                views: {
                    'content@customer.request.id': {
                        templateUrl: 'customer/request/recommended/recommended.html',
                        controller: 'CustomerRequestRecommendedController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Recommended',
                    icon: 'star'
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
            });
    }
})();