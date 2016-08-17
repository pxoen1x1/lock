(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('tabBar', tabBar);

    tabBar.$inject = ['$state', '$mdMedia', '$stateParams'];

    function tabBar($state, $mdMedia, $stateParams) {
        return {
            restrict: 'AE',
            templateUrl: 'core/directives/tab-bar/tab-bar.html',
            scope: {
                items: '='
            },
            link: function (scope, elem, attrs) {
                angular.element(elem).addClass('tab-bar');

                scope.$state = $state;
                scope.$stateParams = $stateParams;
                scope.$mdMedia = $mdMedia;
                
            }
        };
    }
})();