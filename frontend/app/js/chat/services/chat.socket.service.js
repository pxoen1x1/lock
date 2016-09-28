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
            getRequestBids: getRequestBids,
            getMessages: getMessages,
            createChat: createChat,
            sendMessage: sendMessage,
            deleteBid: deleteBid,
            onChat: onChat,
            onBid: onBid,
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

        function getRequestBids(request) {

            return $sails.get('/api/client/request/' + request + '/bids')
                .then(getRequestBidsCompleted);

            function getRequestBidsCompleted(message) {

                return message.data.bids;
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

            return $sails.post('/api/client/request/' + request.id + '/chats', specialist)
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

        function deleteBid(bid) {

            return $sails.delete('/api/bids/' + bid.id)
                .then(deleteBidCompleted);

            function deleteBidCompleted(response) {

                return response.data.bid;
            }
        }

        function onChat(next) {
            socketService.listener('chat', function (event) {
                next(event.chat);
            });
        }

        function onBid(next) {
            socketService.listener('bid', function (event) {
                next(event.bid);
            });
        }

        function onMessage(next) {
            socketService.listener('message', function (event) {
                next(event.message);
            });
        }
    }
})();