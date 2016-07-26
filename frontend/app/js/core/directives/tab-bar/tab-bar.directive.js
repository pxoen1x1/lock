(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('tabBar', tabBar);

    tabBar.$inject = ['$location', '$mdMedia'];

    function tabBar($location, $mdMedia) {
        return {
            restrict: 'AE',
            templateUrl: 'core/directives/tab-bar/tab-bar.html',
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