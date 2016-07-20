// Attributes:
//  onchange - calls when user select a star
//  showChoice - show user choice after he select a star (by default shows what your 'onchange' return)
//  readonly - stars aren't selectable

(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('tabBar', tabBar);

    tabBar.$inject = ['$location', '$mdMedia'];

    function tabBar($location, $mdMedia) {
        return {
            restrict: 'AE',
            templateUrl: '/js/core/directives/tab-bar/tab-bar-customer.html',
            scope: {
                items: '='
            },
            link: function (scope, elem, attrs) {
                angular.element(elem).addClass('tab-bar');
                
                scope.mdMedia = $mdMedia;

                scope.$watch(function() {
                    return $location.path();
                }, function(){
                    scope.path = $location.path();
                });
            }
        };
    }
})();