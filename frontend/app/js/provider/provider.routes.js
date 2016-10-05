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
                        controller: 'ProviderMenuController',
                        controllerAs: 'vm'
                    },
                    'header@provider': {
                        templateUrl: 'layout/header/user-header.html',
                        controller: 'ProviderHeaderController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    title: 'Specialist',
                    isPrivate: true
                }
            })
            .state('provider.registration', {
                url: '/registration',
                views: {
                    'content@root': {
                        templateUrl: 'provider/layout/registration-layout.html'
                    },
                    'content@provider.registration': {
                        templateUrl: 'provider/registration/registration.html',
                        controller: 'ProviderRegistrationController',
                        controllerAs: 'vm'
                    },
                    'header@provider.registration': {
                        templateUrl: 'layout/header/registration-header.html'
                    }
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
                    title: 'Profile',
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
                    title: 'Public',
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
                    title: 'Dashboard',
                    menu: {
                        icon: 'dashboard',
                        title: 'Dashboard'
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
                        controller: 'ProviderDashboardNewController',
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
                    title: 'Current',
                    tab: {
                        title: 'Current',
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
                    title: 'History',
                    tab: {
                        title: 'History',
                        icon: 'history'
                    }
                }
            })
        ;
    }
})();