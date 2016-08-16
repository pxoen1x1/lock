(function () {
    'use strict';

    angular
        .module('app.customer')
        .run(customerRun);

    customerRun.$inject = ['$rootScope', '$state', '$mdMedia', 'customerConstants'];

    /* @ngInject */
    function customerRun($rootScope, $state, $mdMedia, customerConstants) {

        $rootScope.$state = $state;
        $rootScope.$mdMedia = $mdMedia;

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                if (toState.name == 'customer.request') {
                    if (fromState.name == 'customer.request.view') {
                        event.preventDefault();
                        $state.reload();
                    } else {
                        event.preventDefault();
                        if (fromParams.requestId)
                            $state.go('customer.request.view', fromParams);
                        else
                            $state.go('customer.history');
                    }
                }

                var elem = angular.element(document.getElementsByClassName('content'));

                if (customerConstants.MENU_ITEMS.indexOf(fromState.name) < customerConstants.MENU_ITEMS.indexOf(toState.name)) {
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