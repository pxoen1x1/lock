(function () {
    'use strict';

    angular
        .module('app.admin')
        .run(adminRun);

    adminRun.$inject = ['$rootScope', 'adminConstants'];

    /* @ngInject */
    function adminRun($rootScope, adminConstants) {

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState) {

                var elem = angular.element(document.getElementsByClassName('content'));
                var statesFlow = adminConstants.MENU_ITEMS;

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