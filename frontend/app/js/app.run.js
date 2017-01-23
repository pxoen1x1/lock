(function () {
    'use strict';

    angular
        .module('app')
        .run(runApp);

    runApp.$inject = [
        '$rootScope',
        '$state',
        '$mdDialog',
        '$mdMedia',
        'cfpLoadingBar',
        'socketService',
        'authService',
        'usingLanguageService',
        'toastService'
    ];

    /* @ngInject */
    function runApp($rootScope, $state, $mdDialog, $mdMedia, cfpLoadingBar,
                    socketService, authService, usingLanguageService, toastService) {
        socketService.onConnect(function () {
            if (authService.isAuthenticated()) {
                socketService.subscribe();
            }
        });

        $rootScope.$state = $state;
        $rootScope.$mdMedia = $mdMedia;

        $rootScope.$on('$stateChangeStart', function (event, toState) {
            cfpLoadingBar.start();

            if (!usingLanguageService.isLanguageSelected() && toState.name !== 'login') {
                cfpLoadingBar.complete();
                event.preventDefault();

                return usingLanguageService.showUsingLanguageModal()
                    .then(function () {

                        $state.go(toState.name);
                    });
            }

            if (toState.data && !authService.authorize(toState.data.isPrivate)) {
                cfpLoadingBar.complete();
                event.preventDefault();

                toastService.warning('Please log in.');

                if (toState.name !== 'home') {

                    $state.go('home');
                }

                return;
            }

            if (toState.name === 'login') {
                cfpLoadingBar.complete();
                event.preventDefault();

                return $mdDialog.show({
                    templateUrl: 'core/login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    fullscreen: true
                });
            }

            if (toState.name === 'customer.invite' && authService.authorize(toState.data.isPrivate)) {
                cfpLoadingBar.complete();
                event.preventDefault();

                return $mdDialog.show({
                    templateUrl: 'customer/invite/invite.html',
                    controller: 'CustomerInviteController',
                    controllerAs: 'vm'
                });
            }
        });

        $rootScope.$on('$stateChangeError', function () {
            cfpLoadingBar.complete();
        });
        $rootScope.$on('$viewContentLoaded', function () {
            cfpLoadingBar.complete();
        });
        $rootScope.$on('$stateNotFound', function () {
            cfpLoadingBar.complete();
        });
    }
})();