(function () {
    'use strict';

    angular
        .module('app.group')
        .config(configureState);

    configureState.$inject = ['$stateProvider'];

    /* @ngInject */
    function configureState($stateProvider) {
        $stateProvider
            .state('group', {
                parent: 'root',
                abstract: true,
                url: '/group',
                views: {
                    'content@root': {
                        templateUrl: 'group/layout/layout.html',
                    },
                    'menu@group': {
                        templateUrl: 'layout/menu/user-menu.html',
                        controller: 'GroupMenuController',
                        controllerAs: 'vm'
                    },
                    'header@group': {
                        templateUrl: 'layout/header/user-header.html',
                        controller: 'GroupHeaderController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Group',
                    isPrivate: true
                }
            })
            .state('group.dashboard', {
                parent: 'group',
                url: '/dashboard',
                views: {
                    'content@group': {
                        templateUrl: 'group/dashboard/dashboard.html',
                        controller: 'GroupDashboardController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Dashboard',
                    menu: {
                        icon: 'list',
                        title: 'Dashboard'
                    },
                    isPrivate: true
                }
            })
            .state('group.dashboard.new', {
                parent: 'group.dashboard',
                url: '/new',
                views: {
                    'content@group.dashboard': {
                        templateUrl: 'group/dashboard-new/dashboard-new.html',
                        controller: 'GroupNewRequestsController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'New',
                    tab: {
                        title: 'New',
                        icon: 'whatshot'
                    }
                }
            })
            .state('group.dashboard.current', {
                parent: 'group.dashboard',
                url: '/current',
                views: {
                    'content@group.dashboard': {
                        templateUrl: 'group/dashboard-current/dashboard-current.html',
                        controller: 'GroupDashboardCurrentController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Current',
                    tab: {
                        title: 'Current',
                        icon: 'list'
                    }
                }
            })
            .state('group.dashboard.history', {
                parent: 'group.dashboard',
                url: '/history',
                views: {
                    'content@group.dashboard': {
                        templateUrl: 'group/dashboard-history/dashboard-history.html',
                        controller: 'GroupDashboardHistoryController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'History',
                    tab: {
                        title: 'History',
                        icon: 'history'
                    }
                }
            })
            .state('group.dashboard.request', {
                parent: 'group.dashboard',
                abstract: true,
                url: '/{requestId:int}',
                views: {
                    'content@group': {
                        templateUrl: 'group/request/request.html',
                        controller: 'GroupRequestController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    isPrivate: true
                }
            })
            .state('group.dashboard.request.info', {
                parent: 'group.dashboard.request',
                url: '/info',
                views: {
                    'content@group.dashboard.request': {
                        templateUrl: 'group/request-info/request-info.html',
                        controller: 'GroupRequestInfoController',
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
            .state('group.dashboard.request.map', {
                parent: 'group.dashboard.request',
                url: '/map',
                views: {
                    'content@group.dashboard.request': {
                        templateUrl: 'group/request-map/request-map.html',
                        controller: 'GroupRequestMapController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Map',
                    tab: {
                        title: 'Map',
                        icon: 'location_on'
                    }
                }
            })
            .state('group.members', {
                parent: 'group',
                url: '/members',
                views: {
                    'content@group': {
                        templateUrl: 'group/members/members.html',
                        controller: 'GroupMembersController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Members',
                    menu: {
                        icon: 'list',
                        title: 'Members'
                    }
                }
            })
            .state('group.members.info', {
                parent: 'group.members',
                url: '/{memberId:int}',
                views: {
                    'content@group': {
                        templateUrl: 'group/member-info/member-info.html',
                        controller: 'GroupMemberInfoController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Member Info'
                }
            });
    }
})();