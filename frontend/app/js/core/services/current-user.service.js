(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('currentUserService', currentUserService);

    currentUserService.$inject = ['$q', 'coreDataservice', 'localService', 'coreConstants'];

    /* @ngInject */
    function currentUserService($q, coreDataservice, localService, coreConstants) {
        var getUserPromise;
        var getUserPaymentPromise;
        var getMerchantPromise;
        var userType;

        var service = {
            getUser: getUser,
            getMerchant: getMerchant,
            updateMerchant: updateMerchant,
            getMerchantAccount: getMerchantAccount,
            setUserToLocalStorage: setUserToLocalStorage,
            getUserPayment: getUserPayment,
            setUserPayment: setUserPayment,
            setUser: setUser,
            getType: getType,
            clearType: clearType
        };

        return service;

        function getUser() {
            if (!isAuthenticated()) {

                return $q.reject(new Error('You are not logged.'));
            }

            return $q.when(getUserFromLocalStorage() || getUserFromHttp());
        }

        function getUserFromLocalStorage() {

            return localService.getUser();
        }

        function setUserToLocalStorage(currentUser) {

            return localService.setUser(currentUser);
        }

        function getUserFromHttp() {
            if (getUserPromise) {
                getUserPromise.cancel();
            }

            getUserPromise = coreDataservice.getCurrentUser();

            return getUserPromise
                .then(getUserFromHttpComplete)
                .catch(getUserFromHttpFailed);
        }

        function getUserFromHttpComplete(response) {

            var currentUser = response.data.user;

            localService.setUser(currentUser);

            return currentUser;
        }

        function getUserFromHttpFailed(error) {

            return error;
        }

        function getMerchant(){

            getMerchantPromise = coreDataservice.getCurrentMerchant();

            return getMerchantPromise
                .then(function(merchant){
                    return merchant.data;
                })
                .catch(function(error){return error;});
        }

        function getMerchantAccount(){

            getMerchantPromise = coreDataservice.getCurrentUserPayment();

            return getMerchantPromise
                .then(function(merchant){
                    return merchant.data;
                })
                .catch(function(error){return error;});
        }

        function getUserPayment(){

            getUserPaymentPromise = coreDataservice.getCurrentUserPayment();

            return getUserPaymentPromise
                .then(function(userPayment){
                    return userPayment.data;
                })
                .catch(function(error){return error;});
        }

        function setUserPayment(userPayment){

            var setUserPaymentPromise = coreDataservice.setCurrentUserPayment(userPayment);

            return setUserPaymentPromise
                .then(function(userPayment){
                    return userPayment.data;
                })
                .catch(function(error){return error;});
        }

        function updateMerchant(profileData){

            var merchantDataPromise = coreDataservice.updateMerchant(profileData);

            return merchantDataPromise
                .then(function(merchantData){
                    return merchantData.data;
                })
                .catch(function(error){return error;});
        }

        function setUser(user) {

            return setUserToHttp(user)
                .then(function (currentUser) {

                    localService.setUser(currentUser);
                    setCurrentUserType(currentUser);

                    return currentUser;
                });
        }

        function setUserToHttp(user) {

            return coreDataservice.updateUser(user)
                .then(setUserToHttpComplete)
                .catch(setUserToHttpFailed);
        }

        function setUserToHttpComplete(response) {

            return response.data.user;
        }

        function setUserToHttpFailed(error) {

            return error;
        }

        function getType() {
            if (!isAuthenticated()) {

                return $q.reject(new Error('You are not logged.'));
            }

            return $q.when(userType || getCurrentUserType());
        }

        function getCurrentUserType() {

            return getUser()
                .then(setCurrentUserType);
        }

        function setCurrentUserType(currentUser) {
            if (currentUser.isAdmin) {
                userType = coreConstants.USER_TYPES.ADMIN;
            } else if (currentUser.details && currentUser.details.id) {
                userType = coreConstants.USER_TYPES.SPECIALIST;
            } else {
                userType = coreConstants.USER_TYPES.CLIENT;
            }

            return userType;
        }

        function clearType() {
            userType = null;
        }

        function isAuthenticated() {

            return localService.getAuth();
        }
    }
})();