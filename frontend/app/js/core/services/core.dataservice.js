(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('coreDataservice', coreDataservice);

    coreDataservice.$inject = ['$http', 'request', 'conf', '$sails'];

    /* @ngInject */
    function coreDataservice($http, request, conf, $sails) {
        var service = {
            getLanguages: getLanguages,
            getServiceTypes: getServiceTypes,
            getStates: getStates,
            getCities: getCities,
            getTranslation: getTranslation,
            getPolicies: getPolicies,
            getCurrentUser: getCurrentUser,
            getUser: getUser,
            getFeedbacks: getFeedbacks,
            getNewRequests: getNewRequests,
            getRequest: getRequest,
            getAvailabilityInfo: getAvailabilityInfo,
            getAdminsGroup: getAdminsGroup,
            getSpecialistsGroupAdmin: getSpecialistsGroupAdmin,
            setGroupSpAgreed: setGroupSpAgreed,
            getCustomer: getCustomer,
            getBankAccountTypes: getBankAccountTypes,
            getMerchant: getMerchant,
            getMerchantAccount: getMerchantAccount,
            getMerchantFunds: getMerchantFunds,
            isCreatedTodaysPayout: isCreatedTodaysPayout,
            withdrawal: withdrawal,
            saveDeviceInfo: saveDeviceInfo,
            createUser: createUser,
            createAuthTxn: createAuthTxn,
            createCaptureTxn: createCaptureTxn,
            createTokenAndAuthTxn: createTokenAndAuthTxn,
            setMerchantAccount: setMerchantAccount,
            reverseAuthTxn: reverseAuthTxn,
            login: login,
            logout: logout,
            resetUserPassword: resetUserPassword,
            updateUser: updateUser,
            updateCustomer: updateCustomer,
            updateRequestStatus: updateRequestStatus,
            updateMerchant: updateMerchant,
            updateCustomerCard: updateCustomerCard,
            acceptOffer: acceptOffer,
        };

        return service;

        function getLanguages() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'lists/languages',
                method: 'GET'
            });
        }

        function getServiceTypes() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'lists/service-types',
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

        function getTranslation(langKey) {

            return $sails.get(conf.URL_PREFIX + 'translations/' + langKey)
                .then(getTranslationCompleted);

            function getTranslationCompleted(message) {

                return message.data.translation;
            }
        }

        function getPolicies() {

            return $sails.get(conf.URL_PREFIX + 'policies')
                .then(getPoliciesComplete);

            function getPoliciesComplete(message) {

                return message.data.policies;
            }
        }

        function getCurrentUser() {

            return $sails.get(conf.URL_PREFIX + 'user')
                .then(getCurrentUserComplete);

            function getCurrentUserComplete(message) {

                return message.data.user;
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

        function getAdminsGroup() {

            return $sails.get(conf.URL_PREFIX + 'group').then(getAdminsGroupComplete);

            function getAdminsGroupComplete(response) {

                return response.data.group;
            }
        }

        function getSpecialistsGroupAdmin(userId) {

            return $sails.get(conf.URL_PREFIX + 'group/getspecialistsgroupadmin/'+userId).then(findGroupAdminByChatMembersComplete);

            function findGroupAdminByChatMembersComplete(response) {

                return response.body.groupAdmin;
            }
        }

        function setGroupSpAgreed(groupId) {

            return $sails.post(conf.URL_PREFIX + 'group/spagreed', {groupId: groupId}).then(setSpAgreedComplete);

            function setSpAgreedComplete(response) {

                return response.data.group[0];
            }
        }



        function getCustomer() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'customer',
                method: 'GET'
            }).then(getCustomerComplete);

            function getCustomerComplete(response) {

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

        function getMerchant() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'merchantentity',
                method: 'GET'
            }).then(getCurrentMerchantComplete);

            function getCurrentMerchantComplete(response) {

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

        function getMerchantFunds() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'merchantfunds',
                method: 'GET'
            }).then(getMerchantFundsComplete);

            function getMerchantFundsComplete(response) {

                return response.data.merchantFunds;
            }
        }

        function isCreatedTodaysPayout() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'splashpayment/iscreatedtodayspayout',
                method: 'GET'
            }).then(isCreatedTodaysPayoutComplete);

            function isCreatedTodaysPayoutComplete(response) {

                return response.data;
            }
        }

        function withdrawal() {

            return request.httpWithTimeout({
                url: conf.BASE_URL + conf.URL_PREFIX + 'splashpayment/withdrawal',
                method: 'GET'
            }).then(withdrawalComplete);

            function withdrawalComplete(response) {

                return response.data;
            }
        }

        function saveDeviceInfo(deviceInfo) {

            return $sails.post(conf.URL_PREFIX + 'devices', deviceInfo)
                .then(saveDeviceInfoComplete);

            function saveDeviceInfoComplete(response) {

                return response.data.device;
            }
        }

        function createUser(newUser) {

            return $sails.post(conf.URL_PREFIX + 'user', newUser)
                .then(createUserComplete);

            function createUserComplete(response) {

                return response.data;
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

        function createCaptureTxn(requestId) {
            return $sails.post(conf.URL_PREFIX + 'splashpayment/capturetxn', {requestId: requestId})
                .then(createCaptureTxnComplete);

            function createCaptureTxnComplete(response) {

                return response.data;
            }
        }

        function createTokenAndAuthTxn(txnData, merchantId, amount, requestId) {
            var params = {
                txnData: txnData,
                merchantId: merchantId,
                amount: amount,
                requestId: requestId
            };

            return $sails.post(conf.URL_PREFIX + 'splashpayment/tokenandauthtxn', params)
                .then(createTokenAndAuthTxnComplete);

            function createTokenAndAuthTxnComplete(response) {
                return response.data;
            }
        }

        function setMerchantAccount(paymentData) {

            return $sails.post(conf.URL_PREFIX + 'merchantaccount', paymentData)
                .then(setMerchantAccountComplete);

            function setMerchantAccountComplete(response) {

                return response.data.userPayment;
            }
        }

        function reverseAuthTxn(requestId) {
            return $sails.post(conf.URL_PREFIX + 'splashpayment/reverseauthtxn', {requestId: requestId})
                .then(reverseAuthTxnComplete);

            function reverseAuthTxnComplete(response) {
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

        function logout(params) {

            return $sails.post('/auth/logout', params)
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

        function updateCustomer(customerData) {

            return $sails.put(conf.URL_PREFIX + 'customer', customerData)
                .then(updateCurrentCustomerComplete);

            function updateCurrentCustomerComplete(response) {

                return response.data;
            }
        }

        function updateRequestStatus(request, status) {

            return $sails.put(conf.URL_PREFIX + 'requests/' + request.id + '/status', status)
                .then(updateRequestStatusCompleted);

            function updateRequestStatusCompleted(response) {

                return response.data.request;
            }
        }

        function updateMerchant(merchantData) {

            return $sails.put(conf.URL_PREFIX + 'merchantentity', merchantData)
                .then(updateMerchantComplete);

            function updateMerchantComplete(response) {

                return response.data.merchantEntity;
            }
        }

        function updateCustomerCard(cardData) {
            return $sails.put(conf.URL_PREFIX + 'customercard', cardData)
                .then(updateCustomerCardComplete);

            function updateCustomerCardComplete(response) {

                return response.data;
            }
        }

        function acceptOffer(requestId, request) {

            return $sails.put(conf.URL_PREFIX + 'client/requests/' + requestId, request)
                .then(acceptOfferCompleted);

            function acceptOfferCompleted(response) {

                return response.data.request;
            }
        }
    }
})();