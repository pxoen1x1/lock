(function () {
    'use strict';

    angular
        .module('app.chat')
        .factory('chatSocketservice', chatSocketservice);

    chatSocketservice.$inject = ['$sails', 'conf'];

    /* @ngInject */
    function chatSocketservice($sails, conf) {
        var service = {
            getChats: getChats,
            createChat: createChat
        };

        return service;

        function getChats(request) {

            return $sails.get(conf.BASE_URL + 'api/client/request/' + request + '/chats')
                .then(getChatsCompleted);

            function getChatsCompleted(message) {

                return message.data.chats;
            }
        }

        function createChat(request, contact) {

            return $sails.post(conf.BASE_URL + 'api/request/' + request.id + '/chats', contact)
                .then(createChatCompleted);

            function createChatCompleted(response) {

                return response.data.chat;
            }
        }
    }
})();