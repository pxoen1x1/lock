(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('tabBar', tabBar);

    tabBar.$inject = ['$state', '$mdMedia'];

    function tabBar($state, $mdMedia) {
        return {
            restrict: 'AE',
            templateUrl: 'core/directives/tab-bar/tab-bar.html',
            scope: {
                data: '='
            },
            link: function (scope, elem, attrs) {
                angular.element(elem).addClass('tab-bar');

                scope.$state = $state;
                scope.$mdMedia = $mdMedia;
                
            }
        };
    }
})();