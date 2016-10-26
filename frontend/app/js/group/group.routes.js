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
            .state('group.registration', {
                url: '/registration',
                views: {
                    'content@root': {
                        templateUrl: 'group/layout/registration-layout.html'
                    },
                    'content@group.registration': {
                        templateUrl: 'group/registration/registration.html',
                        controller: 'GroupRegistrationController',
                        controllerAs: 'vm'
                    },
                    'header@group.registration': {
                        templateUrl: 'layout/header/registration-header.html'
                    }
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
            });
    }
})();