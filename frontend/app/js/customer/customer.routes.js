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
                },
                data: {
                    title: 'Client'
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
            .state('customer.newRequest', {
                parent: 'customer',
                url: '/request/new',
                views: {
                    'content@customer': {
                        templateUrl: 'customer/request-new/request-new.html',
                        controller: 'CustomerNewRequestController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'New',
                    menu: {
                        title: 'New request',
                        icon: 'playlist_add'
                    }
                }
            })
            .state('customer.requests', {
                parent: 'customer',
                url: '/requests',
                views: {
                    'content@customer': {
                        templateUrl: 'customer/requests-list/requests-list.html',
                        controller: 'CustomerRequestsListController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Requests',
                    menu: {
                        title: 'Requests',
                        icon: 'list'
                    }
                }
            })
            .state('customer.requests.request', {
                parent: 'customer.requests',
                abstract: true,
                url: '/{requestId:int}',
                views: {
                    'content@customer': {
                        templateUrl: 'customer/request/request.html',
                        controller: 'CustomerRequestController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: ''
                }
            })
            .state('customer.requests.request.view', {
                parent: 'customer.requests.request',
                url: '/view',
                views: {
                    'content@customer.requests.request': {
                        templateUrl: 'customer/request-view/request-view.html',
                        controller: 'CustomerViewRequestController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Request',
                    tab: {
                        title: 'View',
                        icon: 'list'
                    }
                }
            })
            .state('customer.requests.request.map', {
                parent: 'customer.requests.request',
                url: '/map',
                views: {
                    'content@customer.requests.request': {
                        templateUrl: 'customer/request-map/request-map.html',
                        controller: 'CustomerRequestMapController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Request',
                    tab: {
                        title: 'Map',
                        icon: 'location_on'
                    }
                }
            })
            .state('customer.requests.request.chat', {
                parent: 'customer.requests.request',
                url: '/chat',
                views: {
                    'content@customer.requests.request': {
                        templateUrl: 'customer/request-chat/request-chat.html',
                        controller: 'CustomerRequestChatController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Request',
                    tab: {
                        title: 'Chat',
                        icon: 'chat'
                    }
                }
            })
            .state('customer.requests.request.recommended', {
                parent: 'customer.requests.request',
                url: '/recommended',
                views: {
                    'content@customer.requests.request': {
                        templateUrl: 'customer/request-recommended/request-recommended.html',
                        controller: 'CustomerRequestRecommendedController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Request',
                    tab: {
                        title: 'Recommended',
                        icon: 'star'
                    }
                }
            })
            .state('customer.settings', {
                parent: 'customer',
                url: '/settings',
                data: {
                    title: 'Settings',
                    menu: {
                        title: 'Settings',
                        icon: 'settings'
                    }
                }
            })
            .state('customer.profile', {
                parent: 'customer',
                url: '/profile',
                views: {
                    'content@customer': {
                        templateUrl: 'customer/profile/profile.html',
                        controller: 'CustomerProfileController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Profile'
                }
            })
            .state('customer.invite', {
                reloadOnSearch: false,
                data: {
                    menu: {
                        title: 'Invite a friend',
                        icon: 'message'
                    }
                }
            });
    }
})();