(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('socketService', socketService);

    socketService.$inject = ['$sails'];

    /* @ngInject */
    function socketService($sails) {
        var service = {
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            onConnect: onConnect,
            listener: listener,
            stopListener: stopListener
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

        function listener(eventIdentity, next) {

            return $sails.on(eventIdentity, function () {

                next.apply($sails, arguments);
            });
        }

        function stopListener(eventIdentity, handler){

            return $sails.off(eventIdentity, handler);
        }
    }
})();