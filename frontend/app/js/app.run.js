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
        'toastService',
        'mobileService'
    ];

    /* @ngInject */
    function runApp($rootScope, $state, $mdDialog, $mdMedia, cfpLoadingBar,
                    socketService, authService, usingLanguageService, toastService, mobileService) {
        socketService.onConnect(function () {
            if (authService.isAuthenticated()) {
                socketService.subscribe();
            }
        });

        $rootScope.$state = $state;
        $rootScope.$mdMedia = $mdMedia;
        $rootScope.$isMobile = mobileService.isMobileApplication();

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

                if (toState.name !== 'home.main') {

                    $state.go('home.main');
                }

                return;
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