(function () {
    'use strict';

    angular
        .module('app.customer')
        .run(customerRun);

    customerRun.$inject = [
        '$rootScope',
        '$state',
        'cfpLoadingBar',
        'coreConstants',
        'customerConstants',
        'currentUserService'
    ];

    /* @ngInject */
    function customerRun($rootScope, $state, cfpLoadingBar, coreConstants, customerConstants, currentUserService) {

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState) {
                var elem = angular.element(document.getElementsByClassName('content'));
                var statesFlow = customerConstants.MENU_ITEMS.concat(customerConstants.REQUEST_TABBAR_ITEMS);

                if (statesFlow.indexOf(fromState.name) < statesFlow.indexOf(toState.name)) {
                    elem.addClass('anim-slide-left');
                    elem.removeClass('anim-slide-right');
                } else {
                    elem.addClass('anim-slide-right');
                    elem.removeClass('anim-slide-left');
                }

                currentUserService.getType()
                    .then(function (userType) {
                        if (userType !== coreConstants.USER_TYPES.CLIENT) {

                            return;
                        }

                        if (toState.name !== 'customer.blocker') {
                            cfpLoadingBar.complete();
                            event.preventDefault();

                            $state.go('customer.blocker');
                        }
                    });
            }
        );
    }
})();