(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('coreSocketDataservice', coreSocketDataservice);

    coreSocketDataservice.$inject = ['$sails'];

    /* @ngInject */
    function coreSocketDataservice($sails) {
        var service = {
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            onConnect: onConnect,
            onMessages: onMessages
        };

        return service;

        function subscribe() {
            $sails.post('/socket/subscribe')
                .then(function (message) {

                    return message.data;
                });
        }

        function unsubscribe() {
            $sails.post('/socket/unsubscribe')
                .then(function (message) {

                    return message.data;
                });
        }

        function onConnect(next) {
            listener('connect', next);
        }

        function onMessages(next) {
            listener('message', next);
        }

        function listener(eventIdentity, next) {

            return $sails.on(eventIdentity, function () {

                next.apply($sails, arguments);
            });
        }
    }
})();