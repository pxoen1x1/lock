(function () {
    'use strict';

    angular
        .module('app')
        .run(runApp);

    runApp.$inject = [
        '$rootScope',
        '$q',
        '$state',
        '$mdDialog',
        '$mdMedia',
        'cfpLoadingBar',
        'coreConstants',
        'coreDataservice',
        'socketService',
        'authService',
        'usingLanguageService',
        'currentUserService',
        'toastService',
        'mobileService',
        'backgroundCheckService'
    ];

    /* @ngInject */
    function runApp($rootScope, $q, $state, $mdDialog, $mdMedia, cfpLoadingBar, coreConstants, coreDataservice,
                    socketService, authService, usingLanguageService, currentUserService, toastService, mobileService,
                    backgroundCheckService) {
        socketService.onConnect(function () {
            if (authService.isAuthenticated()) {
                socketService.subscribe();
            }
        });

        $rootScope.$state = $state;
        $rootScope.$mdMedia = $mdMedia;
        $rootScope.$isMobile = mobileService.isMobileApplication();

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            cfpLoadingBar.start();

            if (toState.data && toState.data.isPrivate) {
                blockUsers(event, toState, toParams, fromParams);
            }

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

                if (toState.name !== 'login') {

                    $state.go('login');
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

        function blockUsers(event, toState, toParams, fromParams) {
            if (fromParams.skipSomeAsync) {

                return;
            }

            cfpLoadingBar.complete();
            event.preventDefault();

            $q.all(
                [
                    coreDataservice.getPolicies(),
                    currentUserService.getType(),
                    backgroundCheckService.isBackgroundCheckCompleted()
                ]
            )
                .then(function (results) {
                    var policies = results[0];
                    var userType = results[1];
                    var isCompleted = results[2];

                    fromParams.skipSomeAsync = true;

                    if (policies.isBGCheckEnabled && !isCompleted &&
                        userType === coreConstants.USER_TYPES.SPECIALIST) {

                        return backgroundCheckService.showBackgroundCheckDialog();
                    }

                    if (policies.isCustomersLockingEnabled && userType === coreConstants.USER_TYPES.CLIENT) {

                        return $state.go('customer.blocker');
                    }

                    $state.go(toState, toParams);
                });
        }
    }
})();