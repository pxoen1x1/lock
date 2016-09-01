(function () {
    'use strict';

    angular
        .module('app.provider')
        .run(providerRun);

    providerRun.$inject = ['$rootScope', 'serviceProviderConstants'];

    /* @ngInject */
    function providerRun($rootScope, serviceProviderConstants) {

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {

                var elem = angular.element(document.getElementsByClassName('content'));
                var statesFlow = serviceProviderConstants.MENU_ITEMS;//.concat(serviceProviderConstants.REQUEST_TABBAR_ITEMS);

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