(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('coreSocketDataservice', coreSocketDataservice);

    coreSocketDataservice.$inject = ['$sails'];

    /* @ngInject */
    function coreSocketDataservice($sails) {
        var service = {
            subscribeSocket: subscribeSocket,
            unsubscribeSocket: unsubscribeSocket,
            listenUserEvents: listenUserEvents
        };

        return service;

        function subscribeSocket() {
            $sails.post('/socket/subscribe')
                .then(function (message) {

                    return message.data;
                });
        }

        function unsubscribeSocket() {
            $sails.post('/socket/unsubscribe')
                .then(function (message) {

                    return message.data;
                });
        }

        function listenUserEvents() {

            $sails.on('message', function (message) {

                return message;
            });
        }
    }
})();