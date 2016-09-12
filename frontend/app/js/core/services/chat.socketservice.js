(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('chatSocketservice', chatSocketservice);

    chatSocketservice.$inject = ['$q', '$sails', 'conf'];

    /* @ngInject */
    function chatSocketservice($q, $sails, conf) {
        var service = {
            getChats: getChats,
            listenChats: listenChats
        };

        return service;

        function getChats(request) {

            return $sails.get(conf.BASE_URL + 'api/request/' + request + '/chats')
                .then(getChatsCompleted);

            function getChatsCompleted(message) {

                return message;
            }
        }

        function listenChats() {

            $sails.on('chat', function(message) {
                console.log(message);
            });
        }
    }
})();