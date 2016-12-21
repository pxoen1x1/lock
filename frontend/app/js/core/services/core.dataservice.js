(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('coreDataservice', coreDataservice);

    coreDataservice.$inject = ['$http', 'request', 'conf', '$sails'];

    /* @ngInject */
    function coreDataservice($http, request, conf, $sails) {
        var service = {
            getCurrentUser: getCurrentUser,
            getCurrentMerchant: getCurrentMerchant,
            updateMerchant: updateMerchant,
            getCurrentCustomer: getCurrentCustomer,
            updateCurrentCustomer: updateCurrentCustomer,
            updateCustomerCard: updateCustomerCard,
            getCurrentUserPayment: getCurrentUserPayment,
            setCurrentUserPayment: setCurrentUserPayment,
            createTxn: createTxn,
            createTokenAndTxn: createTokenAndTxn,
            getUser: getUser,
            getFeedbacks: getFeedbacks,
            getServiceTypes: getServiceTypes,
            getLanguages: getLanguages,
            getStates: getStates,
            getCities: getCities,
            getNewRequests: getNewRequests,
            getRequest: getRequest,
            getAvailabilityInfo: getAvailabilityInfo,
            createUser: createUser,
            login: login,
            logout: logout,
            resetUserPassword: resetUserPassword,
            updateUser: updateUser,
            acceptOffer: acceptOffer,
            updateRequestStatus: updateRequestStatus
        };

        return service;

        function getCurrentUser() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'user',
                method: 'GET'
            });
        }

        function getCurrentCustomer() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'customer',
                method: 'GET'
            });
        }

        function updateCurrentCustomer(customerData) {

            return $sails.put(conf.URL_PREFIX + 'customer', customerData)
                .then(updateCurrentCustomerComplete);

            function updateCurrentCustomerComplete(response) {

                return response;
            }
        }

        function updateCustomerCard(cardData) {

            return $sails.put(conf.URL_PREFIX + 'customercard', cardData)
                .then(updateCustomerCardComplete);

            function updateCustomerCardComplete(response) {

                return response;
            }
        }

        function getCurrentMerchant() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'merchantentity',
                method: 'GET'
            });
        }

        function updateMerchant(merchantData) {

            return $sails.put(conf.URL_PREFIX + 'merchantentity', merchantData)
                .then(updateMerchantComplete);

            function updateMerchantComplete(response) {

                return response;
            }
        }

        function getCurrentUserPayment() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'userpayment',
                method: 'GET'
            });
        }

        function setCurrentUserPayment(paymentData) {

            return $sails.post(conf.URL_PREFIX + 'userpayment', paymentData)
                .then(setCurrentUserPaymentComplete);

            function setCurrentUserPaymentComplete(response) {

                return response;
            }
        }

        function createTxn(txnData) {
            return $sails.post(conf.URL_PREFIX + 'splashpayment/txn', txnData)
                .then(createTxnComplete);

            function createTxnComplete(response) {

                return response;
            }
        }

        function createTokenAndTxn(params) {
            return $sails.post(conf.URL_PREFIX + 'splashpayment/tokenandtxn', params)
                .then(createTokenAndTxnComplete);

            function createTokenAndTxnComplete(response) {

                return response.data.txnData;
            }
        }

        function getUser(userId) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'users/' + userId,
                method: 'GET'
            });
        }

        function getFeedbacks(userId) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'users/' + userId + '/feedbacks',
                method: 'GET'
            });
        }

        function getServiceTypes() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'lists/service-types',
                method: 'GET'
            });
        }

        function getLanguages() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'lists/languages',
                method: 'GET'
            });
        }

        function getStates() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'lists/states',
                method: 'GET'
            });
        }

        function getCities(stateId, params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'lists/states/' + stateId + '/cities',
                method: 'GET',
                params: params
            });
        }

        function getNewRequests(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'specialist/requests/new',
                method: 'GET',
                params: params
            });
        }

        function getRequest(userType, currentRequest) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + userType + '/requests/' + currentRequest.id,
                method: 'GET'
            });
        }

        function getAvailabilityInfo(params) {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'users',
                method: 'GET',
                params: params
            });
        }

        function createUser(newUser) {

            return $sails.post(conf.URL_PREFIX + 'user', newUser)
                .then(createUserComplete);

            function createUserComplete(response) {

                return response.data;
            }
        }

        function login(user, type) {
            var loginType = type || 'local';

            return $sails.post('/auth/login?type=' + loginType, user)
                .then(loginComplete);

            function loginComplete(response) {

                return response.data;
            }
        }

        function logout() {

            return $sails.post('/auth/logout')
                .then(logoutComplete);

            function logoutComplete(response) {

                return response.data;
            }
        }

        function resetUserPassword(user) {

            return $sails.post('/auth/password/reset', user)
                .then(resetPasswordCompleted);

            function resetPasswordCompleted(response) {

                return response.data;
            }
        }

        function updateUser(user) {

            return $sails.put(conf.URL_PREFIX + 'user', user)
                .then(updateUserComplete);

            function updateUserComplete(response) {

                return response;
            }
        }

        function acceptOffer(requestId, request) {

            return $sails.put(conf.URL_PREFIX + 'client/requests/' + requestId, request)
                .then(acceptOfferCompleted);

            function acceptOfferCompleted(response) {

                return response.data.request;
            }
        }

        function updateRequestStatus(request, status) {

            return $sails.put(conf.URL_PREFIX + 'requests/' + request.id + '/status', status)
                .then(updateRequestStatusCompleted);

            function updateRequestStatusCompleted(response) {

                return response.data.request;
            }
        }
    }
})();