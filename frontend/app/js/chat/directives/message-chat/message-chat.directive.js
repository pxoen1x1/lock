(function () {
    'use strict';

    angular
        .module('app.chat')
        .directive('messageChat', messageChat);

    messageChat.$inject = ['$compile', '$templateCache'];

    /* @ngInject */
    function messageChat($compile, $templateCache) {
        var directive = {
            bindToController: true,
            controller: ControllerName,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {
                message: '=',
                currentUser: '='
            },
            replace: true
        };
        return directive;

        function link(scope, element) {
            var vm = scope.vm;

            var messageTemplate = '';

            if (vm.message.type === 1) {
                messageTemplate = $templateCache.get('chat/directives/message-chat/message.html');
            }

            element.html(messageTemplate);

            $compile(element.contents())(scope);
        }
    }

    ControllerName.$inject = ['coreConstants', 'chatConstants'];

    /* @ngInject */
    function ControllerName(coreConstants, chatConstants) {
        var vm = this;

        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.dateFormat = coreConstants.DATE_FORMAT;
        vm.status = coreConstants.REQUEST_STATUSES;
        vm.messageType = chatConstants.MESSAGE_TYPES;
    }
})();