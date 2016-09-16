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
            createChat: createChat,
            sendMessage: sendMessage
        };

        return service;

        function getChats(request) {

            return $sails.get(conf.BASE_URL + 'api/client/request/' + request + '/chats')
                .then(getChatsCompleted);

            function getChatsCompleted(message) {

                return message.data.chats;
            }
        }

        function createChat(request, specialist) {

            return $sails.post(conf.BASE_URL + 'api/request/' + request.id + '/chats', specialist)
                .then(createChatCompleted);

            function createChatCompleted(response) {

                return response.data.chat;
            }
        }

        function sendMessage(chat, message) {

            return $sails.post(conf.BASE_URL + 'api/chats/' + chat.id + '/messages', message)
                .then(sendMessageCompleted);

            function sendMessageCompleted(response) {

                return response.data.message;
            }
        }
    }
})();