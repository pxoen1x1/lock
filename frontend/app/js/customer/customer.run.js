(function () {
    'use strict';

    angular
        .module('app.customer')
        .run(customerRun);

    customerRun.$inject = ['$rootScope', '$state', 'customerConstants'];

    /* @ngInject */
    function customerRun($rootScope, $state, customerConstants) {

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {

                var elem = angular.element(document.getElementsByClassName('content'));
                var statesFlow = customerConstants.MENU_ITEMS.concat(customerConstants.REQUEST_TABBAR_ITEMS);

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