// Attributes:
//  showChoice - showing your choice after you've rated it (by default shows what your 'onchange' return)
//  readonly - stars are not selectable

(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('tabBar', tabBar);

    function tabBar() {
        return {
            restrict: 'AE',
            template:
                '<div ng-if="customer" ng-include="\'/js/core/directives/templates/tabBarCustomer.html\'" ng-controller="CustomerLayoutController as vm"></div>'
               +'<div ng-if="provider" ng-include="\'/js/core/directives/templates/tabBarProvider.html\'" ng-controller="ProviderLayoutController as vm"></div>',
            scope: {
            },
            link: function (scope, elem, attrs) {
                scope.customer = 'customer' in attrs;
                scope.provider = 'provider' in attrs;

                angular.element(elem).addClass('tab-bar');
            }
        };
    }
})();