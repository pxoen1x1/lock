// Attributes:
//  showChoice - showing your choice after you've rated it (by default shows what your 'onchange' return)
//  readonly - stars are not selectable

(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('starRating', starRating);

    function starRating() {
        return {
            restrict: 'AE',
            template: '<ul class="rating">' +
            '<li ng-repeat="star in stars track by $index"' +
            'ng-mouseover="mouseOver($index)"' +
            'ng-click="ratingChange($index)">' +
            '<i class="material-icons" ng-if="star.filled">star</i>' +
            '<i class="material-icons" ng-if="star.half">star_half</i>' +
            '<i class="material-icons" ng-if="star.border">star_border</i>' +
            '</li>' +
            '</ul>',
            scope: {
                value: '=',
                max: '=?',
                onchange: '&'
            },
            link: function (scope, elem, attrs) {
                scope.value = scope.value || 0;
                scope.max = scope.max || 5;
                scope.readonly = 'readonly' in attrs;
                scope.showChoice = 'showchoice' in attrs;

                if (scope.readonly) {
                    angular.element(elem)[0].style.cursor = 'default';
                }

                angular.element(elem).addClass('star-rating');
                angular.element(elem).attr('title', scope.ratingValue);

                var updateStars = function () {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled: i < scope.value && i + 1 <= scope.value,
                            half: i < scope.value && i + 1 > scope.value,
                            border: i >= scope.value
                        });
                    }
                };

                scope.mouseOver = function (index) {
                    if (scope.readonly) {

                        return;
                    }

                    angular.element(elem).attr('title', index + 1);
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled: i <= index,
                            half: false,
                            border: i > index
                        });
                    }
                };

                scope.ratingChange = function (index) {
                    if (scope.readonly) {

                        return;
                    }

                    if (scope.showChoice) {
                        scope.value = index + 1;
                    } else {
                        scope.value = scope.onchange({
                            rating: index + 1
                        });
                    }
                };

                scope.$watch('value',
                    function (value) {
                        angular.element(elem).attr('title', value);
                        updateStars();
                    }
                );

            }
        };
    }
})();