(function () {
    'use strict';

    angular
        .module('app.chat')
        .factory('chatSocketservice', chatSocketservice);

    chatSocketservice.$inject = ['$sails', 'socketService', 'conf'];

    /* @ngInject */
    function chatSocketservice($sails, socketService, conf) {
        var service = {
            getClientChats: getClientChats,
            getSpecialistChats: getSpecialistChats,
            getRequestBids: getRequestBids,
            getSpecialistBids: getSpecialistBids,
            getMessages: getMessages,
            getReviews: getReviews,
            subscribeToChat: subscribeToChat,
            createChat: createChat,
            createBid: createBid,
            sendMessage: sendMessage,
            deleteBid: deleteBid,
            declineBid: declineBid,
            onRequest: onRequest,
            onChat: onChat,
            onBid: onBid,
            onMessage: onMessage,
            offRequest: offRequest,
            offChat: offChat,
            offBid: offBid,
            offMessage: offMessage
        };

        return service;

        function getClientChats(request) {

            return $sails.get(conf.URL_PREFIX + 'client/request/' + request.id + '/chats')
                .then(getClientChatsCompleted);

            function getClientChatsCompleted(message) {

                return message.data.chats;
            }
        }

        function getSpecialistChats() {

            return $sails.get(conf.URL_PREFIX + 'specialist/chats')
                .then(getSpecialistChatsCompleted);

            function getSpecialistChatsCompleted(message) {

                return message.data.chats;
            }
        }

        function getRequestBids(request) {

            return $sails.get(conf.URL_PREFIX + 'client/request/' + request.id + '/bids')
                .then(getRequestBidsCompleted);

            function getRequestBidsCompleted(message) {

                return message.data.bids;
            }
        }

        function getSpecialistBids() {

            return $sails.get(conf.URL_PREFIX + 'specialist/bids')
                .then(getSpecialistBidsCompleted);

            function getSpecialistBidsCompleted(message) {

                return message.data.bids;
            }
        }

        function getMessages(chat, params) {

            return $sails.get(conf.URL_PREFIX + 'chats/' + chat.id + '/messages', params)
                .then(getMessagesCompleted);

            function getMessagesCompleted(response) {

                return response.data;
            }
        }

        function getReviews(user, params) {

            return $sails.get(conf.URL_PREFIX + 'users/' + user.id + '/feedbacks', params)
                .then(getReviewsComplete);

            function getReviewsComplete(response) {

                return response.data;
            }
        }

        function subscribeToChat(chat) {

            return $sails.post(conf.URL_PREFIX + 'chat/' + chat.id + '/subscribe')
                .then(function (message) {

                    return message.data;
                });
        }

        function createChat(request, specialist) {

            return $sails.post(conf.URL_PREFIX + 'client/request/' + request.id + '/chats', specialist)
                .then(createChatCompleted);

            function createChatCompleted(response) {

                return response.data.chat;
            }
        }

        function createBid(request, bid) {

            return $sails.post(conf.URL_PREFIX + 'specialist/request/' + request.id + '/bids', bid)
                .then(createBidCompleted);

            function createBidCompleted(response) {

                return response.data.bid;
            }
        }

        function sendMessage(chat, message) {

            return $sails.post(conf.URL_PREFIX + 'chats/' + chat.id + '/messages', message)
                .then(sendMessageCompleted);

            function sendMessageCompleted(response) {

                return response.data.message;
            }
        }

        function declineBid(bid) {

            return $sails.put(conf.URL_PREFIX + 'client/bids/' + bid.id + '/refuse')
                .then(updateBidCompleted);

            function updateBidCompleted(response) {

                return response.data.bid;
            }
        }

        function deleteBid(bid) {

            return $sails.delete(conf.URL_PREFIX + 'bids/' + bid.id)
                .then(deleteBidCompleted);

            function deleteBidCompleted(response) {

                return response.data.bid;
            }
        }

        function onRequest(next) {
            socketService.listener('request', function (event) {
                next(event.request, event.type, event.isBlast);
            });
        }

        function onChat(next) {
            socketService.listener('chat', function (event) {
                next(event.chat, event.type);
            });
        }

        function onBid(next) {
            return socketService.listener('bid', function (event) {
                next(event.bid, event.type);
            });
        }

        function onMessage(next) {
            socketService.listener('message', function (event) {
                next(event.message, event.type);
            });
        }

        function offRequest(handler) {
            socketService.stopListener('request', handler);
        }

        function offChat(handler) {
            socketService.stopListener('chat', handler);
        }

        function offBid(handler) {
            socketService.stopListener('bid', handler);
        }

        function offMessage(handler) {
            socketService.stopListener('message', handler);
        }
    }
})();