(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('infiniteScroll', infiniteScroll);

    infiniteScroll.$inject = ['$q'];

    /* @ngInject */
    function infiniteScroll($q) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                onScroll: '&',
                scrollDistance: '=?',
                scrollDirection: '@'
            }
        };
        return directive;

        function link(scope, element) {
            var removeThrottle;
            var lastScrollTop = 0;
            var scrollCompleted = true;

            var scrollDistance = parseInt(scope.scrollDistance) || 10;
            var scrollDirection = scope.scrollDistance || 'bottom';

            activate();

            function throttle(type, name, obj) {
                var running = false;

                obj = obj || window;

                var listener = function () {
                    if (running) {

                        return;
                    }

                    running = true;

                    requestAnimationFrame(function () {
                        obj.dispatchEvent(new CustomEvent(name));

                        running = false;
                    });
                };

                obj.addEventListener(type, listener);

                return function () {
                    obj.removeEventListener(type, listener);
                };
            }

            function handler() {
                var scrollTop = element[0].scrollTop;
                var scrollingHeight = scrollTop + element[0].clientHeight;
                var remainingPercent = (1 - scrollingHeight / element[0].scrollHeight) * 100;

                var direction = scrollDirection === 'bottom' ?
                scrollTop > lastScrollTop : scrollTop < lastScrollTop;

                if (direction && (remainingPercent <= scrollDistance)) {
                    if (scrollCompleted) {
                        scrollCompleted = false;

                        $q.when(
                            scope.$apply(scope.onScroll)
                        )
                            .finally(function () {
                                scrollCompleted = true;
                            });
                    }
                }

                lastScrollTop = scrollTop;
            }

            function activate() {
                removeThrottle = throttle('scroll', 'optimizedScroll', element[0]);

                element.on('optimizedScroll', handler);

                scope.$on('$destroy', function () {
                    removeThrottle();
                    element.off('optimizedScroll');
                });
            }
        }
    }
})();