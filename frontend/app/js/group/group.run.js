(function () {
    'use strict';

    angular
        .module('app.group')
        .run(groupRun);

    groupRun.$inject = ['$rootScope', 'groupConstants'];

    /* @ngInject */
    function groupRun($rootScope, groupConstants) {

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState) {

                var elem = angular.element(document.getElementsByClassName('content'));
                var statesFlow = groupConstants.MENU_ITEMS;

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