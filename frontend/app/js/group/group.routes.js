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
            });
    }
})();