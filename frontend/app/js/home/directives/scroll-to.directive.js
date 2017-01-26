/**
 * Directive and service for scrolling to element on click.
 * Usage:
 * <span scroll-to=".pivot" offset="" add-height-from=".__mod-sticky">Scroll</span>
 *
 * scrollToService.toSelector(selector, offset, duration).then(function(){})
 * scrollToService.toElement(element, offset, duration).then(function(){})
 * scrollToService.toOffset(offset, duration).then(function(){})
 */
(function () {
    "use strict";

    var scrollTo = angular.module('app.home')
        .directive('scrollTo', scrollToDirective)
        .service('scrollToService', scrollToService);

    scrollToDirective.$inject = ['scrollToService'];

    function scrollToDirective(scrollToService) {
        return {
            restrict: 'AE',
            link: link
        };

        function link(scope, element, attrs) {

            element.bind('click', onClick);

            function onClick(e) {
                e.preventDefault();

                var offset = 0;

                if (attrs.addHeightFrom) {
                    var el = document.querySelector(attrs.addHeightFrom);
                    offset = el ? - el.getBoundingClientRect().height : 0
                }

                if (attrs.offset) {
                    offset += parseInt(attrs.offset);
                }
                scrollToService.toSelector(attrs.scrollTo, offset).then(function () {
                    if (attrs.onScrollHide) {
                        if (element[0].className.indexOf('hidden') < 0) {
                            element[0].className += ' hidden';
                        }
                    }
                });
            }
        }
    }

    scrollToService.$inject = ['$q'];

    function scrollToService($q) {

        this.toOffset = function (to, duration) {
            to = parseInt(to);

            return $q(function (resolve) {

                function scroll(duration) {
                    if (duration < 0) {
                        return
                    }

                    var current = window.pageYOffset;
                    var difference = to - current;
                    var perTick = difference / duration * 10;

                    if (difference == 0) {
                        resolve();
                    } else {
                        setTimeout(function () {
                            window.scrollBy(0, perTick);
                            scroll(duration - 10);
                        }, 10);
                    }
                }

                scroll(duration);
            })
        };

        this.toElement = function (element, offset, duration) {
            offset = offset || 0;
            duration = duration || 600;

            return this.toOffset(element.getBoundingClientRect().top + window.scrollY + offset, duration);
        };

        this.toSelector = function (selector, offset, duration) {

            var element = document.querySelector(selector);

            if (!element) {
                return $q.reject({message: 'Invalid selector'});
            }

            return this.toElement(element, offset, duration);
        };
    }
})();