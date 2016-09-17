(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('coreSocketDataservice', coreSocketDataservice);

    coreSocketDataservice.$inject = ['$sails'];

    /* @ngInject */
    function coreSocketDataservice($sails) {
        var service = {
            subscribeToUserEvents: subscribeToUserEvents,
            listenUserEvents: listenUserEvents
        };

        return service;

        function subscribeToUserEvents(){
            $sails.post('/socket/subscribe')
                .then(function(message){

                    return message.data.jwt;
                });
        }

        function listenUserEvents() {

            $sails.on('user', function(message) {

                return message;
            });
        }
    }
})();