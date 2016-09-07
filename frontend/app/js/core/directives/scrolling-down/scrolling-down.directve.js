(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('scrollingDown', scrollingDown);

    function scrollingDown() {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {}
        };
        return directive;

        function link(scope, element) {
            var contener = element[0];

            scope.$watch(
                function () {

                    return contener.scrollHeight;
                },
                function (newScrollHeight, oldScrollHeight) {
                    if (newScrollHeight === oldScrollHeight) {

                        return;
                    }

                    contener.scrollTop = newScrollHeight;
                });
        }
    }
})();