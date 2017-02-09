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
                        templateUrl: 'layout/menu/user-menu.html',
                        controller: 'UserMenuController',
                        controllerAs: 'vm'
                    },
                    'header@customer': {
                        templateUrl: 'layout/header/user-header.html',
                        controller: 'UserHeaderController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Client'
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
                    title: 'NEW',
                    isPrivate: true,
                    menu: {
                        title: 'NEW_REQUEST',
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
                    title: 'REQUESTS',
                    isPrivate: true,
                    menu: {
                        title: 'REQUESTS',
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
                    title: '',
                    isPrivate: true
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
                    title: 'REQUEST',
                    tab: {
                        title: 'VIEW',
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
                    title: 'REQUEST',
                    tab: {
                        title: 'MAP',
                        icon: 'location_on'
                    }
                }
            })
            .state('customer.requests.request.chat', {
                parent: 'customer.requests.request',
                url: '/chat',
                params: {
                    chat: {}
                },
                views: {
                    'content@customer.requests.request': {
                        templateUrl: 'chat/templates/chat.html',
                        controller: 'ClientChatController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Request',
                    tab: {
                        title: 'CHAT',
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
                        title: 'RECOMMENDED',
                        icon: 'star'
                    }
                }
            })
            .state('customer.settings', {
                parent: 'customer',
                url: '/settings',
                data: {
                    title: 'Settings',
                    isPrivate: true,
                    menu: {
                        title: 'SETTINGS',
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
                    isPrivate: true,
                    title: 'Profile'
                }
            })
            .state('customer.invite', {
                reloadOnSearch: false,
                data: {
                    isPrivate: true,
                    menu: {
                        title: 'INVITE_A_FRIEND',
                        icon: 'message'
                    }
                }
            })
            .state('customer.blocker', {
                parent: 'root',
                url: '/locked',
                views: {
                    'content@root': {
                        templateUrl: 'customer/blocker/blocker.html',
                        controller: 'BlockerDialogController',
                        controllerAs: 'vm'
                    }
                }
            });
    }
})();