(function () {
    'use strict';

    angular
        .module('app.chat')
        .directive('scrollChat', scrollChat);

    scrollChat.$inject = ['$q', '$timeout'];

    /* @ngInject */
    function scrollChat($q, $timeout) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                onScroll: '&scrollChat',
                scrollDistance: '=?scrollChatDistance',
                isScrollDisabled: '=?scrollChatDisabled',
                isScrollToBottomEnabled: '=?scrollChatToBottom'
            }
        };
        return directive;

        function link(scope, element) {
            var chatContainer = element;
            var chat = chatContainer[0];

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
                if (scope.isScrollDisabled) {

                    return;
                }

                var remainingPercent = (chat.scrollTop / chat.scrollHeight) * 100;

                if (chat.scrollTop < lastScrollTop && (remainingPercent <= scope.scrollDistance)) {
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

                lastScrollTop = chat.scrollTop;
            }

            function scrollChatToBottom() {
                if (chat.scrollHeight === 0) {

                    return;
                }

                var lastMessage = chat.querySelectorAll('.chat-message:last-child')[0] || {};

                var isScrolledToBottom =
                    chat.scrollHeight - (chat.clientHeight + chat.scrollTop + lastMessage.clientHeight) <= 0;

                if (isScrolledToBottom || scope.isScrollToBottomEnabled) {
                    chat.scrollTop = chat.scrollHeight;
                    scope.isScrollToBottomEnabled = false;
                }
            }

            function activate() {
                scope.scrollDistance = parseInt(scope.scrollDistance) || 10;
                scope.isScrollDisabled = scope.isScrollDisabled || false;

                removeThrottle = throttle('scroll', 'optimizedScroll', chat);

                chatContainer.on('optimizedScroll', handler);

                scope.$watch(
                    function () {

                        return chat.scrollHeight;
                    },
                    function (newScrollHeight, oldScrollHeight) {
                        if (newScrollHeight === oldScrollHeight) {

                            return;
                        }

                        $timeout(scrollChatToBottom);
                    });

                scope.$on('$destroy', function () {
                    removeThrottle();
                    chatContainer.off('optimizedScroll');
                });
            }
        }
    }
})();