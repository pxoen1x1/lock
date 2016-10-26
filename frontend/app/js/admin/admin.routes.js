(function () {
    'use strict';

    angular
        .module('app.admin')
        .config(configureState);

    configureState.$inject = ['$stateProvider'];

    /* @ngInject */
    function configureState($stateProvider) {
        $stateProvider
            .state('admin', {
                parent: 'root',
                abstract: true,
                url: '/admin',
                views: {
                    'content@root': {
                        templateUrl: 'admin/layout/layout.html',
                    },
                    'menu@admin': {
                        templateUrl: 'layout/menu/user-menu.html',
                        controller: 'AdminMenuController',
                        controllerAs: 'vm'
                    },
                    'header@admin': {
                        templateUrl: 'layout/header/user-header.html',
                        controller: 'AdminHeaderController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Admin'
                }
            })
            .state('admin.users', {
                parent: 'admin',
                url: '/users',
                views: {
                    'content@admin': {
                        templateUrl: 'admin/users/users.html',
                        controller: 'AdminUsersController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Users',
                    menu: {
                        icon: 'people',
                        title: 'Users'
                    },
                    isPrivate: true
                }
            })
            .state('admin.users.clients', {
                parent: 'admin.users',
                url: '/clients',
                views: {
                    'content@admin.users': {
                        templateUrl: 'admin/users-clients/users-clients.html',
                        controller: 'AdminUsersClientsController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Clients',
                    tab: {
                        title: 'Clients',
                        icon: 'people outline'
                    }
                }
            })
            .state('admin.users.providers', {
                parent: 'admin.users',
                url: '/providers',
                views: {
                    'content@admin.users': {
                        templateUrl: 'admin/users-providers/users-providers.html',
                        controller: 'AdminUsersProvidersController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Providers',
                    tab: {
                        title: 'Providers',
                        icon: 'people outline'
                    }
                }
            })
        ;
    }
})();