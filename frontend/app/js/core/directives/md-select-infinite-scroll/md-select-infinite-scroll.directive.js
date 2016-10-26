(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('mdSelectInfiniteScroll', mdSelectInfiniteScroll);

    mdSelectInfiniteScroll.$inject = ['$q'];

    /* @ngInject */
    function mdSelectInfiniteScroll($q) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                onScroll: '&',
                scrollDistance: '=?'
            }
        };
        return directive;

        function link(scope, element) {
            var scrollDistance;
            var searchBox;
            var scrollContainer;
            var removeThrottle;
            var lastScrollTop = 0;
            var scrollCompleted = true;

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
                var scrollTop = scrollContainer[0].scrollTop;
                var scrollingHeight = scrollTop + scrollContainer[0].clientHeight;
                var remainingPercent = (1 - scrollingHeight / scrollContainer[0].scrollHeight) * 100;

                if (scrollTop > lastScrollTop && (remainingPercent <= scrollDistance)) {
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
                scrollDistance = parseInt(scope.scrollDistance) || 10;

                searchBox = element.find('input');
                scrollContainer = element.find('md-content');

                removeThrottle = throttle('scroll', 'optimizedScroll', scrollContainer[0]);

                searchBox.on('keydown', function (env) {
                    env.stopPropagation();
                });

                scrollContainer.on('optimizedScroll', handler);

                scope.$on('$destroy', function () {
                    removeThrottle();
                    scrollContainer.off('optimizedScroll');
                });
            }
        }
    }
})();

