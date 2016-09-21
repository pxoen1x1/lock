(function () {
    'use strict';

    angular
        .module('app.chat')
        .factory('chatSocketservice', chatSocketservice);

    chatSocketservice.$inject = ['$sails', 'socketService'];

    /* @ngInject */
    function chatSocketservice($sails, socketService) {
        var service = {
            getChats: getChats,
            getMessages: getMessages,
            createChat: createChat,
            sendMessage: sendMessage,
            onMessage: onMessage
        };

        return service;

        function getChats(request) {

            return $sails.get('/api/client/request/' + request + '/chats')
                .then(getChatsCompleted);

            function getChatsCompleted(message) {

                return message.data.chats;
            }
        }

        function getMessages(chat, params) {

            return $sails.get('/api/chats/' + chat.id + '/messages', params)
                .then(getMessagesCompleted);

            function getMessagesCompleted(response) {

                return response.data;
            }
        }

        function createChat(request, specialist) {

            return $sails.post('/api/request/' + request.id + '/chats', specialist)
                .then(createChatCompleted);

            function createChatCompleted(response) {

                return response.data.chat;
            }
        }

        function sendMessage(chat, message) {

            return $sails.post('/api/chats/' + chat.id + '/messages', message)
                .then(sendMessageCompleted);

            function sendMessageCompleted(response) {

                return response.data.message;
            }
        }

        function onMessage(next) {
            socketService.listener('message', next);
        }
    }
})();