(function () {
    'use strict';

    angular
        .module('app.provider')
        .run(providerRun);

    providerRun.$inject = [
        '$rootScope',
        'cfpLoadingBar',
        'serviceProviderConstants',
        'authService',
        'specialistGeoService',
        'backgroundCheckService',
        'localService'
    ];

    /* @ngInject */
    function providerRun($rootScope, cfpLoadingBar, serviceProviderConstants, authService, specialistGeoService,
                         backgroundCheckService, localService) {

        if (authService.isAuthenticated()) {
            backgroundCheckService.isBackgroundCheckCompleted()
                .then(function (isCompleted) {
                    if (isCompleted) {

                        specialistGeoService.startGeoTracking();
                    }
                });
        }

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState) {
                if (toState.data && toState.data.isPrivate) {
                    backgroundCheckService.isBackgroundCheckCompleted()
                        .then(function (isCompleted) {

                            if (!isCompleted) {
                                cfpLoadingBar.complete();
                                event.preventDefault();

                                // ToDo: when skip function will be removed in BackgroundCheckController, remove comment
                                // localService.removeUser();

                                return backgroundCheckService.showBackgroundCheckDialog();
                            }
                        });
                }

                var elem = angular.element(document.getElementsByClassName('content'));
                var statesFlow = serviceProviderConstants.MENU_ITEMS;

                if (statesFlow.indexOf(fromState.name) < statesFlow.indexOf(toState.name)) {
                    elem.addClass('anim-slide-left');
                    elem.removeClass('anim-slide-right');
                } else {
                    elem.addClass('anim-slide-right');
                    elem.removeClass('anim-slide-left');
                }
            }
        );
    }
})();