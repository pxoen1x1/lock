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
                console.log(toState);
                if (toState.name === 'customer.request') {
                    if (fromState.name === 'customer.request.id.view') {
                        event.preventDefault();
                        $state.reload();
                    } else {
                        event.preventDefault();
                        if (fromParams.requestId) {
                            $state.go('customer.request.id.view', fromParams);
                        } else {
                            $state.go('customer.request.history');
                        }
                    }
                }

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