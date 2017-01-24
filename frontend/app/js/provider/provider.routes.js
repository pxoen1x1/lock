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
                        templateUrl: 'layout/menu/user-menu.html',
                        controller: 'UserMenuController',
                        controllerAs: 'vm'
                    },
                    'header@provider': {
                        templateUrl: 'layout/header/user-header.html',
                        controller: 'UserHeaderController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'SPECIALIST'
                }
            })
            .state('provider.messages', {
                parent: 'provider',
                url: '/messages',
                views: {
                    'content@provider': {
                        templateUrl: 'chat/templates/chat.html',
                        controller: 'SpecialistChatController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'MESSAGES',
                    menu: {
                        icon: 'list',
                        title: 'MESSAGES'
                    },
                    isPrivate: true
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
                    title: 'PROFILE',
                    isPrivate: true
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
                    title: 'PUBLIC',
                    isPrivate: true
                }
            })
            .state('provider.dashboard', {
                parent: 'provider',
                url: '/dashboard',
                views: {
                    'content@provider': {
                        templateUrl: 'provider/dashboard/dashboard.html',
                        controller: 'ProviderDashboardController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'DASHBOARD',
                    menu: {
                        icon: 'dashboard',
                        title: 'DASHBOARD'
                    },
                    isPrivate: true
                }
            })
            .state('provider.dashboard.new', {
                parent: 'provider.dashboard',
                url: '/new',
                views: {
                    'content@provider.dashboard': {
                        templateUrl: 'provider/dashboard-new/dashboard-new.html',
                        controller: 'SpecialistNewRequestsController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'DASHBOARD_NEW',
                    tab: {
                        title: 'DASHBOARD_NEW',
                        icon: 'whatshot'
                    }
                }
            })
            .state('provider.dashboard.current', {
                parent: 'provider.dashboard',
                url: '/current',
                views: {
                    'content@provider.dashboard': {
                        templateUrl: 'provider/dashboard-current/dashboard-current.html',
                        controller: 'ProviderDashboardCurrentController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'DASHBOARD_CURRENT',
                    tab: {
                        title: 'DASHBOARD_CURRENT',
                        icon: 'list'
                    }
                }
            })
            .state('provider.dashboard.history', {
                parent: 'provider.dashboard',
                url: '/history',
                views: {
                    'content@provider.dashboard': {
                        templateUrl: 'provider/dashboard-history/dashboard-history.html',
                        controller: 'ProviderDashboardHistoryController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'HISTORY',
                    tab: {
                        title: 'HISTORY',
                        icon: 'history'
                    }
                }
            })
            .state('provider.dashboard.request', {
                parent: 'provider.dashboard',
                abstract: true,
                url: '/{requestId:int}',
                views: {
                    'content@provider': {
                        templateUrl: 'provider/request/request.html',
                        controller: 'ProviderRequestController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: '',
                    isPrivate: true
                }
            })
            .state('provider.dashboard.request.info', {
                parent: 'provider.dashboard.request',
                url: '/info',
                views: {
                    'content@provider.dashboard.request': {
                        templateUrl: 'provider/request-info/request-info.html',
                        controller: 'ProviderInfoRequestController',
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
            .state('provider.dashboard.request.map', {
                parent: 'provider.dashboard.request',
                url: '/map',
                views: {
                    'content@provider.dashboard.request': {
                        templateUrl: 'provider/request-map/request-map.html',
                        controller: 'SpecialistRequestMapController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'MAP',
                    tab: {
                        title: 'MAP',
                        icon: 'location_on'
                    }
                }
            })
            .state('provider.dashboard.request.chat', {
                parent: 'provider.dashboard.request',
                url: '/chat',
                views: {
                    'content@provider.dashboard.request': {
                        templateUrl: 'provider/request-chat/request-chat.html',
                        controller: 'SpecialistRequestChatController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'CHAT',
                    tab: {
                        title: 'CHAT',
                        icon: 'chat'
                    }
                }
            });
    }
})();