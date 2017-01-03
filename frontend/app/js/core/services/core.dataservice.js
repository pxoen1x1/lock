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
            getMerchant: getMerchant,
            updateMerchant: updateMerchant,
            getCustomer: getCustomer,
            updateCustomer: updateCustomer,
            getBankAccountTypes: getBankAccountTypes,
            updateCustomerCard: updateCustomerCard,
            getMerchantAccount: getMerchantAccount,
            setMerchantAccount: setMerchantAccount,
            createAuthTxn: createAuthTxn,
            reverseAuthTxn: reverseAuthTxn,
            createCaptureTxn: createCaptureTxn,
            createTokenAndAuthTxn: createTokenAndAuthTxn,
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

        function getCustomer() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'customer',
                method: 'GET'
            }).then(getCustomerComplete);

            function getCustomerComplete(response) {
                return response.data
            }
        }

        function updateCustomer(customerData) {

            return $sails.put(conf.URL_PREFIX + 'customer', customerData)
                .then(updateCurrentCustomerComplete);

            function updateCurrentCustomerComplete(response) {

                return response.data;
            }
        }

        function getBankAccountTypes() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'splashpayment/bankaccounttypes',
                method: 'GET'
            }).then(getBankAccountTypesComplete);

            function getBankAccountTypesComplete(response) {
                return response.data.result;
            }
        }

        function updateCustomerCard(cardData) {
            return $sails.put(conf.URL_PREFIX + 'customercard', cardData)
                .then(updateCustomerCardComplete);

            function updateCustomerCardComplete(response) {
                return response.data;
            }
        }

        function getMerchant() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'merchantentity',
                method: 'GET'
            }).then(getCurrentMerchantComplete);

            function getCurrentMerchantComplete(response) {
                return response.data.merchantEntity;
            }
        }

        function updateMerchant(merchantData) {

            return $sails.put(conf.URL_PREFIX + 'merchantentity', merchantData)
                .then(updateMerchantComplete);

            function updateMerchantComplete(response) {

                return response.data.merchantEntity;
            }
        }

        function getMerchantAccount() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'merchantaccount',
                method: 'GET'
            }).then(getMerchantAccountComplete);

            function getMerchantAccountComplete(response) {

                return response.data.userPayment;
            }
        }

        function setMerchantAccount(paymentData) {

            return $sails.post(conf.URL_PREFIX + 'merchantaccount', paymentData)
                .then(setMerchantAccountComplete);

            function setMerchantAccountComplete(response) {

                return response.data.userPayment;
            }
        }

        function createAuthTxn(merchantId, amount, requestId) {
            return $sails.post(conf.URL_PREFIX + 'splashpayment/authtxn', {
                    merchantId: merchantId,
                    amount: amount,
                    requestId: requestId
                })
                .then(createTxnComplete);

            function createTxnComplete(response) {

                return response.data;
            }
        }

        function createTokenAndAuthTxn(txnData, merchantId, amount) {
            return $sails.post(conf.URL_PREFIX + 'splashpayment/tokenandauthtxn', {
                    txnData: txnData,
                    merchantId: merchantId,
                    amount: amount
                })
                .then(createTokenAndAuthTxnComplete);

            function createTokenAndAuthTxnComplete(response) {
                return response.data;
            }
        }

        function reverseAuthTxn(requestId) {
            return $sails.post(conf.URL_PREFIX + 'splashpayment/reverseauthtxn', {requestId: requestId})
                .then(reverseAuthTxnComplete);

            function reverseAuthTxnComplete(response) {
console.log(response);
                return response.data;
            }
        }

        function createCaptureTxn(requestId) {
            return $sails.post(conf.URL_PREFIX + 'splashpayment/capturetxn', {requestId: requestId})
                .then(createCaptureTxnComplete);

            function createCaptureTxnComplete(response) {

                return response.data;
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